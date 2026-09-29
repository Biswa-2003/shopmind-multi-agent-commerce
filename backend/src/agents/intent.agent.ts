import { z } from "zod";
import {
  AGENT_INTENTS,
  AgentIntent,
  ChatContext,
  IntentDetectionResult,
  REQUIREMENT_TAGS,
} from "../types/assistant.types.js";
import { Product } from "../types/product.types.js";
import { llmService } from "../services/llm.service.js";
import { findMentionedProducts } from "../utils/product-matcher.js";
import { logger } from "../utils/logger.js";

const MAX_QUANTITY = 10;
const MIN_BUDGET = 100;
const MAX_BUDGET = 10_000_000;

// ---------- Keyword rules (used when no AI model is available, and to fill gaps in the AI's answer)

const CATEGORY_KEYWORDS: [RegExp, string][] = [
  [/\b(laptops?|notebooks?|macbook|ultrabook)\b/, "Laptops"],
  [/\b(phones?|smartphones?|mobiles?|iphone|galaxy s|pixel)\b/, "Smartphones"],
  [/\b(headphones?|earbuds?|earphones?|airpods|headsets?|audio)\b/, "Headphones"],
  [/\b(smart ?watch(es)?|watch(es)?|fitness band)\b/, "Smartwatches"],
  [/\b(cameras?|dslr|mirrorless)\b/, "Cameras"],
  [/\b(tablets?|ipad)\b/, "Tablets"],
  [/\b(monitors?|displays?)\b/, "Monitors"],
  [/\b(gaming|console|playstation|ps5|keyboard)\b/, "Gaming"],
  [/\b(vacuum|purifier|appliances?)\b/, "Home Appliances"],
];

const REQUIREMENT_KEYWORDS: [RegExp, (typeof REQUIREMENT_TAGS)[number]][] = [
  [/\b(coding|code|programming|developer|software)\b/, "coding"],
  [/\b(photo|photos|photography|camera|selfies?)\b/, "photography"],
  [/\b(gaming|games?|gamer)\b/, "gaming"],
  [/\b(noise[- ]cancell?ing|anc)\b/, "anc"],
  [/\b(office|work|meetings?|calls?)\b/, "office-work"],
  [/\b(travel|travelling|commute|portable)\b/, "travel"],
  [/\b(video editing|editing|creator|content creation)\b/, "creator"],
  [/\b(cheap|budget|affordable|value)\b/, "budget"],
  [/\b(premium|flagship|high[- ]end)\b/, "premium"],
];

// "under ₹60,000", "budget of 50k", "within 1.5 lakh", "₹30000"
const AMOUNT = String.raw`(\d{1,3}(?:,\d{2,3})+|\d+(?:\.\d+)?)\s*(k|thousand|lakhs?|lacs?|l)?\b`;
const BUDGET_WITH_CUE = new RegExp(
  String.raw`(?:under|below|less than|within|upto|up to|max(?:imum)?|budget(?:\s+of)?|around|about|₹|rs\.?|inr)\s*(?:₹|rs\.?|inr)?\s*` + AMOUNT,
  "i"
);
// "50k", "1.5 lakh" without a cue word; bare numbers are ignored so "iPhone 15" is not a budget
const BUDGET_WITH_UNIT = /\b(\d+(?:\.\d+)?)\s*(k|thousand|lakhs?|lacs?)\b/i;

export function parseBudget(text: string): number | undefined {
  const match = BUDGET_WITH_CUE.exec(text) ?? BUDGET_WITH_UNIT.exec(text);
  if (!match) return undefined;
  let amount = parseFloat(match[1].replace(/,/g, ""));
  const unit = match[2]?.toLowerCase();
  if (unit === "k" || unit === "thousand") amount *= 1000;
  else if (unit && /^(lakhs?|lacs?|l)$/.test(unit)) amount *= 100_000;
  amount = Math.round(amount);
  return amount >= MIN_BUDGET && amount <= MAX_BUDGET ? amount : undefined;
}

const REFERS_BACK = /\b(it|its|it's|this|that|they|them|their|these|those|both|one|first|second|third|last)\b/;

function ordinalIndex(text: string): number | undefined {
  if (/\b(first|1st)\b/.test(text)) return 0;
  if (/\b(second|2nd)\b/.test(text)) return 1;
  if (/\b(third|3rd)\b/.test(text)) return 2;
  if (/\blast\b/.test(text)) return -1;
  return undefined;
}

// ---------- AI parsing

const llmIntentSchema = z.object({
  intent: z.enum(AGENT_INTENTS as [AgentIntent, ...AgentIntent[]]),
  category: z.string().nullish(),
  budget: z.number().nullish(),
  requirements: z.array(z.string()).nullish(),
  productIds: z.array(z.string()).nullish(),
  quantity: z.number().nullish(),
});

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export class IntentAgent {
  /** Uses the AI model when available, falling back to (and filling gaps from) keyword rules. */
  async detectIntent(query: string, ctx: ChatContext, catalog: Product[]): Promise<IntentDetectionResult> {
    const rules = this.detectWithRules(query, ctx, catalog);
    const ai = await this.detectWithLLM(query, ctx, catalog);
    if (!ai) return rules;

    return {
      intent: ai.intent,
      category: ai.category ?? rules.category,
      budget: ai.budget ?? rules.budget,
      requirements: ai.requirements?.length ? ai.requirements : rules.requirements,
      productIds: ai.productIds?.length ? ai.productIds : rules.productIds,
      quantity: ai.quantity ?? rules.quantity,
      source: "llm",
    };
  }

  detectWithRules(query: string, ctx: ChatContext, catalog: Product[]): IntentDetectionResult {
    const q = query.toLowerCase();

    // Which products is the user talking about? Named ones first, else ones shown earlier ("it", "the second one")
    let productIds = findMentionedProducts(query, catalog, 4).map((p) => p.id);
    const refersBack = productIds.length === 0 && ctx.lastProductIds.length > 0 && REFERS_BACK.test(q);
    if (refersBack) {
      const index = ordinalIndex(q);
      const firstN = /\b(?:first|top)\s+(two|three|2|3)\b/.exec(q)?.[1];
      if (firstN) {
        productIds = ctx.lastProductIds.slice(0, firstN === "three" || firstN === "3" ? 3 : 2);
      } else if (index !== undefined) {
        const picked = ctx.lastProductIds.at(index);
        productIds = picked ? [picked] : [];
      } else {
        productIds = ctx.lastProductIds;
      }
    }

    const category = CATEGORY_KEYWORDS.find(([re]) => re.test(q))?.[1];
    const budget = parseBudget(query);
    const requirements = REQUIREMENT_KEYWORDS.filter(([re]) => re.test(q)).map(([, tag]) => tag);
    const quantityMatch = /\b(?:add|buy|put|get)\s+(\d{1,2})\b/.exec(q) ?? /\b(\d{1,2})\s*(?:x|units?|pieces|pcs|qty)\b/.exec(q);
    const quantity = quantityMatch ? Math.min(MAX_QUANTITY, Math.max(1, parseInt(quantityMatch[1], 10))) : undefined;

    let intent: AgentIntent;
    const asksForAdvice = /\b(should|which|what|best|recommend|suggest|worth)\b/.test(q);
    if (
      /\b(add|put)\b.*\b(cart|bag|basket)\b/.test(q) ||
      (productIds.length > 0 && /\b(add|buy|order|purchase)\b/.test(q) && !asksForAdvice)
    ) {
      intent = "cart_request";
    } else if (
      /\bcompare\b|\bvs\.?\b|\bversus\b|difference between|which is better|better than/.test(q) ||
      (productIds.length >= 2 && /\b(which|better|difference|differ)\b/.test(q))
    ) {
      intent = "product_comparison";
    } else if (
      productIds.length >= 1 &&
      (/^(is|does|do|can|what|how|will|has|have|tell me)\b/.test(q) ||
        /\?$/.test(q.trim()) ||
        /\b(warranty|battery|weight|specs?|specifications|water|resistant|display|storage|ram|processor)\b/.test(q))
    ) {
      intent = "product_question";
    } else if (/^(is|does|can|what is|how long)\b/.test(q) || /\b(warranty|water resistant)\b/.test(q)) {
      intent = "product_question";
    } else if (/\b(recommend|suggest|best|good|which|under|below|budget|within)\b/.test(q)) {
      intent = "product_recommendation";
    } else if (/^(hi|hello|hey|namaste|thanks|thank you|ok|okay|cool)\b/.test(q) && !category && productIds.length === 0) {
      intent = "general_shopping";
    } else {
      intent = "product_search";
    }

    return { intent, category, budget, requirements, productIds, quantity, source: "rules" };
  }

  private async detectWithLLM(
    query: string,
    ctx: ChatContext,
    catalog: Product[]
  ): Promise<Omit<IntentDetectionResult, "source"> | null> {
    if (!llmService.isAvailable()) return null;

    const categories = [...new Set(catalog.map((p) => p.category))];
    const catalogLines = catalog.map((p) => `${p.id} | ${p.name} | ${p.category} | ₹${p.price}`).join("\n");
    const history = ctx.history
      .slice(-6)
      .map(
        (t) =>
          `${t.role.toUpperCase()}: ${truncate(t.content, 300)}${t.productIds?.length ? ` [products shown: ${t.productIds.join(", ")}]` : ""}`
      )
      .join("\n");

    const system = `You parse shopping messages for an Indian electronics store. Reply with ONLY a JSON object, no other text:
{"intent": one of ${JSON.stringify(AGENT_INTENTS)},
 "category": one of ${JSON.stringify(categories)} or null,
 "budget": maximum price in rupees as a number, or null (e.g. "under 50k" -> 50000, "1.5 lakh" -> 150000),
 "requirements": array of any of ${JSON.stringify(REQUIREMENT_TAGS)},
 "productIds": ids from the catalog that the user refers to, by name or by "it/this/that/the second one" pointing at products shown earlier,
 "quantity": number of units for cart requests, or null}
Intent guide: cart_request = wants to add/buy a product; product_comparison = compare two or more; product_question = question about a specific product's specs/features; product_recommendation = wants suggestions; product_search = browsing/listing.
Catalog (id | name | category | price):
${catalogLines}`;

    const text = await llmService.generateResponse(
      [
        { role: "system", content: system },
        { role: "user", content: `Conversation so far:\n${history || "(none)"}\n\nNew message: ${query}` },
      ],
      { deadlineMs: 6000, maxTokens: 300, temperature: 0 }
    );
    if (!text) return null;

    const parsed = llmIntentSchema.safeParse(extractJson(text));
    if (!parsed.success) {
      logger.warn("[IntentAgent] AI returned unusable JSON, using keyword rules");
      return null;
    }

    // Never trust the model's values blindly: keep only ids, categories and tags that exist
    const ids = new Set(catalog.map((p) => p.id));
    const { intent, category, budget, requirements, productIds, quantity } = parsed.data;
    return {
      intent,
      category: category && categories.includes(category) ? category : undefined,
      budget: budget && budget >= MIN_BUDGET && budget <= MAX_BUDGET ? Math.round(budget) : undefined,
      requirements: (requirements ?? []).filter((r) => (REQUIREMENT_TAGS as readonly string[]).includes(r)),
      productIds: [...new Set((productIds ?? []).filter((id) => ids.has(id)))],
      quantity: quantity ? Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity))) : undefined,
    };
  }
}

export const intentAgent = new IntentAgent();
