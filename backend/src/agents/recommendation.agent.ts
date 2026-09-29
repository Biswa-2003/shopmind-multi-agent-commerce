import { AgentResponse, ChatContext } from "../types/assistant.types.js";
import { Product } from "../types/product.types.js";
import { productSearchAgent } from "./product-search.agent.js";
import { productService } from "../services/product.service.js";
import { llmService } from "../services/llm.service.js";
import { toLLMHistory } from "../services/conversation.service.js";

export class RecommendationAgent {
  async recommend(params: {
    category?: string;
    budget?: number;
    requirements?: string[];
    query: string;
    catalog?: Product[];
    ctx?: ChatContext;
  }): Promise<AgentResponse> {
    const catalog = params.catalog ?? (await productService.getAllProducts());
    const candidates = await productSearchAgent.search({
      category: params.category,
      budget: params.budget,
      query: params.query,
      tags: params.requirements,
      catalog,
    });

    let productsToRecommend = candidates.slice(0, 3);
    let overBudget = false;
    if (productsToRecommend.length === 0) {
      // Nothing fits: show the cheapest options in the category instead of an empty answer
      const inCategory = params.category
        ? catalog.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase())
        : catalog;
      productsToRecommend = [...inCategory].sort((a, b) => a.price - b.price).slice(0, 3);
      overBudget = Boolean(params.budget);
    }

    const budgetText = params.budget ? `₹${params.budget.toLocaleString("en-IN")}` : "";
    let explanation = `I found these products that best match your criteria:`;
    if (overBudget) {
      explanation = `I couldn't find ${params.category?.toLowerCase() ?? "products"} under ${budgetText}. These are the most affordable options we have:`;
    } else if (params.category && params.budget) {
      explanation = `Here are the top ${params.category.toLowerCase()} under ${budgetText}:`;
    } else if (params.category) {
      explanation = `Here are our highest-rated recommendations in ${params.category}:`;
    }

    // Try AI generation with real context
    try {
      const productListSummary = productsToRecommend
        .map(
          (p) =>
            `- ${p.name} (${p.category}, ₹${p.price.toLocaleString("en-IN")}): ${p.features.slice(0, 3).join(", ")}. Tags: ${p.tags.join(", ")}`
        )
        .join("\n");

      const llmExplanation = await llmService.generateResponse([
        {
          role: "system",
          content: `You are ShopMind AI, a shopping advisor for an Indian electronics store. A customer wants a recommendation.
Reply in 2-3 sentences, recommending the best match(es) ONLY from the products below and explaining why their specs fit what the customer asked for. Use ₹ for prices. Never mention products that are not listed.
${overBudget ? `None of these are within the customer's budget of ${budgetText}; say so honestly.\n` : ""}Products:
${productListSummary}`,
        },
        ...toLLMHistory(params.ctx),
        { role: "user", content: params.query },
      ]);

      if (llmExplanation) {
        explanation = llmExplanation;
      }
    } catch {
      // Gracefully retain template explanation
    }

    const top = productsToRecommend[0];
    return {
      agentName: "RecommendationAgent",
      intent: "product_recommendation",
      content: explanation,
      recommendedProducts: productsToRecommend,
      suggestedFollowUps: [
        productsToRecommend.length >= 2 ? "Compare the first two" : "Show similar products",
        top ? `Add the ${top.name} to my cart` : "Show best sellers",
        top ? `What are the specs of the ${top.name}?` : "Recommend something premium",
      ],
    };
  }
}

export const recommendationAgent = new RecommendationAgent();
