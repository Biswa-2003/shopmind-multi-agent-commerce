import { recommendationAgent } from "../agents/recommendation.agent.js";
import { comparisonAgent } from "../agents/comparison.agent.js";
import { AgentResponse } from "../types/assistant.types.js";

export class RecommendationService {
  async getRecommendations(category?: string, budget?: number, query = ""): Promise<AgentResponse> {
    return await recommendationAgent.recommend({ category, budget, query });
  }

  async compareProducts(productIds: string[]): Promise<AgentResponse> {
    return await comparisonAgent.compare({ productIds });
  }
}

export const recommendationService = new RecommendationService();
