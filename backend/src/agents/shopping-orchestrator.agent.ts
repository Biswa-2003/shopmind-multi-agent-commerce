import { AgentResponse, ChatContext, IntentDetectionResult } from "../types/assistant.types.js";
import { Product } from "../types/product.types.js";
import { intentAgent } from "./intent.agent.js";
import { productSearchAgent } from "./product-search.agent.js";
import { recommendationAgent } from "./recommendation.agent.js";
import { comparisonAgent } from "./comparison.agent.js";
import { productQAAgent } from "./product-qa.agent.js";
import { llmService } from "../services/llm.service.js";
import { productService } from "../services/product.service.js";
import { conversationService, toLLMHistory } from "../services/conversation.service.js";
import { logger } from "../utils/logger.js";

const MAX_SEARCH_RESULTS = 6;

export class ShoppingOrchestratorAgent {
  /**
   * Handles one chat message: loads the conversation so far, works out what the user wants,
   * routes to the right specialist agent, then saves the exchange.
   */
  async processQuery(
    query: string,
    options: { conversationId?: string; userId?: string } = {}
  ): Promise<AgentResponse> {
    const conversationId = await conversationService.resolveConversation(options.conversationId, options.userId);
    const [ctx, catalog] = await Promise.all([
      conversationService.getContext(conversationId),
      productService.getAllProducts(),
    ]);

    // 1. Intent Detection
    const detected = await intentAgent.detectIntent(query, ctx, catalog);
    logger.debug(
      `[Orchestrator] intent=${detected.intent} via ${detected.source} products=${detected.productIds.join(",") || "-"} ` +
        `category=${detected.category ?? "-"} budget=${detected.budget ?? "-"}`
    );

    // 2. Route to Specialist Agent
    const response = await this.route(query, detected, ctx, catalog);

    // 3. Remember this exchange for follow-up questions
    await conversationService.saveExchange(conversationId, query, response);
    return { ...response, conversationId };
  }

  private async route(
    query: string,
    detected: IntentDetectionResult,
    ctx: ChatContext,
    catalog: Product[]
  ): Promise<AgentResponse> {
    switch (detected.intent) {
      case "product_comparison":
        return comparisonAgent.compare({
          productIds: detected.productIds,
          query,
          category: detected.category,
          catalog,
          ctx,
        });

      case "product_question":
        return productQAAgent.answerQuestion({ query, productIds: detected.productIds, catalog, ctx });

      case "cart_request":
        return this.handleCartRequest(query, detected, catalog);

      case "product_recommendation":
        return recommendationAgent.recommend({
          category: detected.category,
          budget: detected.budget,
          requirements: detected.requirements,
          query,
          catalog,
          ctx,
        });

      case "product_search":
      case "general_shopping":
      default:
        return this.handleSearch(query, detected, ctx, catalog);
    }
  }

  /** Returns an add_to_cart action the client performs, so guests and logged-in users behave the same. */
  private handleCartRequest(query: string, detected: IntentDetectionResult, catalog: Product[]): AgentResponse {
    const byId = new Map(catalog.map((p) => [p.id, p]));
    const wantsAll = /\b(both|all|them|these|those)\b/i.test(query);
    const targets = (wantsAll ? detected.productIds.slice(0, 3) : detected.productIds.slice(0, 1))
      .map((id) => byId.get(id))
      .filter((p): p is Product => Boolean(p));

    if (targets.length === 0) {
      return {
        agentName: "CartActionAgent",
        intent: "cart_request",
        content:
          'Which product would you like me to add to your cart? Tell me its name, for example "Add the Sony WH-1000XM5 to my cart".',
        recommendedProducts: [],
        suggestedFollowUps: ["Recommend a laptop under ₹60,000", "Show me the best headphones"],
      };
    }

    const available = targets.filter((p) => p.availability === "in-stock");
    const unavailable = targets.filter((p) => p.availability !== "in-stock");
    const quantity = detected.quantity ?? 1;

    const parts: string[] = [];
    if (available.length > 0) {
      const names = available
        .map((p) => `${quantity > 1 ? `${quantity} × ` : ""}${p.name} (₹${p.price.toLocaleString("en-IN")})`)
        .join(" and ");
      parts.push(`Done! I've added ${names} to your cart.`);
    }
    if (unavailable.length > 0) {
      parts.push(`Sorry, ${unavailable.map((p) => p.name).join(" and ")} ${unavailable.length > 1 ? "are" : "is"} currently out of stock.`);
    }

    const first = targets[0];
    return {
      agentName: "CartActionAgent",
      intent: "cart_request",
      content: parts.join(" "),
      recommendedProducts: targets,
      actions: available.map((p) => ({ type: "add_to_cart", productId: p.id, quantity, product: p })),
      suggestedFollowUps: [
        `Compare the ${first.name} with alternatives`,
        `What are the specs of the ${first.name}?`,
        `Show more ${first.category.toLowerCase()}`,
      ],
    };
  }

  private async handleSearch(
    query: string,
    detected: IntentDetectionResult,
    ctx: ChatContext,
    catalog: Product[]
  ): Promise<AgentResponse> {
    const byId = new Map(catalog.map((p) => [p.id, p]));
    const named = detected.productIds.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
    const searched = await productSearchAgent.search({
      category: detected.category,
      budget: detected.budget,
      query,
      tags: detected.requirements,
      catalog,
    });
    // Small talk ("hi", "thanks") with nothing product-related: reply without product cards
    const isSmallTalk =
      detected.intent === "general_shopping" && named.length === 0 && !detected.category && !detected.budget;
    // Products the user named come first
    const results = isSmallTalk
      ? []
      : [...named, ...searched.filter((p) => !named.some((n) => n.id === p.id))].slice(0, MAX_SEARCH_RESULTS);

    let content = results.length
      ? `I found ${results.length} product(s) matching your request:`
      : isSmallTalk
        ? "Hi! I'm ShopMind AI. Tell me what you're looking for, for example \"a laptop under ₹60,000 for coding\"."
        : "I couldn't find products matching that. Try a category like laptops, phones or headphones.";
    try {
      const llmText = await llmService.generateResponse([
        {
          role: "system",
          content: `You are ShopMind AI, a friendly shopping assistant for an Indian electronics store. Answer the customer's message helpfully and concisely (2 sentences max). ${
            results.length
              ? `If relevant, mention 1 or 2 of these matching products: ${results.slice(0, 3).map((p) => `${p.name} (₹${p.price.toLocaleString("en-IN")})`).join(", ")}.`
              : isSmallTalk
                ? "Greet them and ask what they're shopping for."
                : "No products matched their request."
          } Never mention products that are not in this list.`,
        },
        ...toLLMHistory(ctx),
        { role: "user", content: query },
      ]);
      if (llmText) {
        content = llmText;
      }
    } catch {
      // fallback to default
    }

    return {
      agentName: "ProductSearchAgent",
      intent: detected.intent,
      content,
      recommendedProducts: results,
      suggestedFollowUps: [
        "Which one do you recommend?",
        "Compare the first two",
        "Show options under ₹60,000",
      ],
    };
  }
}

export const shoppingOrchestrator = new ShoppingOrchestratorAgent();
