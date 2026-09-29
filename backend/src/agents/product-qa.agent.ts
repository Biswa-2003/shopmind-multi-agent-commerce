import { AgentResponse, ChatContext } from "../types/assistant.types.js";
import { Product } from "../types/product.types.js";
import { productService } from "../services/product.service.js";
import { llmService } from "../services/llm.service.js";
import { toLLMHistory } from "../services/conversation.service.js";
import { findMentionedProducts } from "../utils/product-matcher.js";

/** Finds spec lines whose name appears in the question, e.g. "battery" -> "Battery: 65Wh (Up to 10.5 Hours)". */
function relevantSpecs(product: Product, question: string): string[] {
  const q = question.toLowerCase();
  return Object.entries(product.specifications)
    .filter(([key]) => key.toLowerCase().split(/[^a-z]+/).some((word) => word.length > 2 && q.includes(word)))
    .map(([key, value]) => `${key}: ${value}`);
}

export class ProductQAAgent {
  async answerQuestion(params: {
    query: string;
    productIds?: string[];
    catalog?: Product[];
    ctx?: ChatContext;
  }): Promise<AgentResponse> {
    const { query } = params;
    const catalog = params.catalog ?? (await productService.getAllProducts());
    const product =
      catalog.find((p) => p.id === params.productIds?.[0]) ?? findMentionedProducts(query, catalog, 1)[0];

    // Never guess: answering about the wrong product is worse than asking
    if (!product) {
      return {
        agentName: "ProductQAAgent",
        intent: "product_question",
        content:
          'Which product is your question about? Include its name, for example "What is the battery life of the MacBook Air M3?"',
        recommendedProducts: [],
        suggestedFollowUps: [
          "What is the battery life of the MacBook Air M3?",
          "Does the Sony WH-1000XM5 have noise cancelling?",
          "Is the Apple Watch Ultra 2 water resistant?",
        ],
      };
    }

    let answer = "";
    try {
      const llmAnswer = await llmService.generateResponse([
        {
          role: "system",
          content: `You are ShopMind AI, a product specialist for an Indian electronics store. Answer the customer's question clearly and concisely (2-3 sentences max) using ONLY the product data below. If the data doesn't cover the question, say you don't have that detail rather than guessing.
Product: ${product.name}
Brand: ${product.brand}
Category: ${product.category}
Price: ₹${product.price.toLocaleString("en-IN")}
Availability: ${product.availability}
Specs: ${JSON.stringify(product.specifications)}
Features: ${product.features.join(", ")}
Description: ${product.description}`,
        },
        ...toLLMHistory(params.ctx),
        { role: "user", content: query },
      ]);
      if (llmAnswer) {
        answer = llmAnswer;
      }
    } catch {
      // graceful fallback below
    }

    if (!answer) {
      const specs = relevantSpecs(product, query);
      answer = specs.length
        ? `Here's what the manufacturer specifications say for the ${product.name}: ${specs.join("; ")}.`
        : `Based on manufacturer specifications for the ${product.name}: it features ${product.features.join(", ")}. Key specs: ${Object.entries(
            product.specifications
          )
            .map(([k, v]) => `${k}: ${v}`)
            .join("; ")}.`;
      answer += product.availability === "in-stock" ? " It's currently in stock." : " It's currently out of stock.";
    }

    return {
      agentName: "ProductQAAgent",
      intent: "product_question",
      content: answer,
      recommendedProducts: [product],
      suggestedFollowUps: [
        `Add the ${product.name} to my cart`,
        `Compare the ${product.name} with alternatives`,
        `What are all the specs of the ${product.name}?`,
      ],
    };
  }
}

export const productQAAgent = new ProductQAAgent();
