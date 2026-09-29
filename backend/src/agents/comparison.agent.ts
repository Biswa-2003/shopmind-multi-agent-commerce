import { Product } from "../types/product.types.js";
import { AgentResponse, ChatContext } from "../types/assistant.types.js";
import { productService } from "../services/product.service.js";
import { llmService } from "../services/llm.service.js";
import { toLLMHistory } from "../services/conversation.service.js";
import { findMentionedProducts } from "../utils/product-matcher.js";

const MAX_COMPARE = 3;

/** The closest-priced other product in the same category, as a sensible comparison partner. */
function closestAlternative(product: Product, catalog: Product[]): Product | undefined {
  return catalog
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))[0];
}

export class ComparisonAgent {
  async compare(params: {
    productIds?: string[];
    query?: string;
    category?: string;
    catalog?: Product[];
    ctx?: ChatContext;
  }): Promise<AgentResponse> {
    const catalog = params.catalog ?? (await productService.getAllProducts());
    const byId = new Map(catalog.map((p) => [p.id, p]));

    // 1. Products named by id (API / intent), else by name in the message
    let items = (params.productIds ?? []).map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
    if (items.length === 0 && params.query) {
      items = findMentionedProducts(params.query, catalog, MAX_COMPARE);
    }

    // 2. One product named: compare it with its closest alternative
    if (items.length === 1) {
      const alternative = closestAlternative(items[0], catalog);
      if (alternative) items.push(alternative);
    }

    // 3. None named: top picks in the category, or whatever was shown last in the chat
    if (items.length === 0 && params.category) {
      items = catalog
        .filter((p) => p.category.toLowerCase() === params.category!.toLowerCase())
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 2);
    }
    if (items.length === 0 && params.ctx?.lastProductIds.length) {
      items = params.ctx.lastProductIds.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
    }

    items = items.slice(0, MAX_COMPARE);

    if (items.length < 2) {
      return {
        agentName: "ComparisonAgent",
        intent: "product_comparison",
        content:
          'Which products would you like me to compare? Name two, for example "Compare the iPhone 15 Pro vs the Galaxy S24 Ultra".',
        recommendedProducts: items,
        suggestedFollowUps: [
          "Compare iPhone 15 Pro vs Galaxy S24 Ultra",
          "Compare Sony WH-1000XM5 vs Bose QuietComfort Ultra",
          "Compare MacBook Air M3 vs Acer Swift Go 14",
        ],
      };
    }

    const [item1, item2] = items;
    const priceList = items.map((p) => `${p.name} (₹${p.price.toLocaleString("en-IN")})`).join(" vs ");
    let content = `Compared ${priceList}. Both offer distinct advantages depending on your priorities; see the side-by-side specs below.`;

    try {
      const llmComparison = await llmService.generateResponse([
        {
          role: "system",
          content: `You are ShopMind AI, an expert tech comparison assistant for an Indian electronics store. Compare these products concisely (2-3 sentences max), highlighting key trade-offs and who should buy which. Use only the facts below and ₹ for prices.
${items
  .map(
    (p, i) =>
      `${i + 1}. ${p.name} - Price: ₹${p.price.toLocaleString("en-IN")}, Rating: ${p.rating}★, Specs: ${JSON.stringify(p.specifications)}, Features: ${p.features.join(", ")}`
  )
  .join("\n")}`,
        },
        ...toLLMHistory(params.ctx),
        {
          role: "user",
          content: params.query || `Compare ${items.map((p) => p.name).join(" vs ")}`,
        },
      ]);
      if (llmComparison) {
        content = llmComparison;
      }
    } catch {
      // fallback to default comparison string
    }

    return {
      agentName: "ComparisonAgent",
      intent: "product_comparison",
      content,
      recommendedProducts: items,
      comparisonMatrix: {
        items: items.map((p) => ({ id: p.id, name: p.name, price: p.price, rating: p.rating })),
        item1: { name: item1.name, price: item1.price, rating: item1.rating },
        item2: { name: item2.name, price: item2.price, rating: item2.rating },
      },
      suggestedFollowUps: [
        `Add the ${item1.name} to my cart`,
        `Add the ${item2.name} to my cart`,
        "Which one has better battery life?",
      ],
    };
  }
}

export const comparisonAgent = new ComparisonAgent();
