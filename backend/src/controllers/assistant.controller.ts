import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { assistantService } from "../services/assistant.service.js";
import { recommendationService } from "../services/recommendation.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const chatSchema = z.object({
  message: z.string().trim().min(1, "Field 'message' is required").max(1000, "Message is too long (max 1000 characters)"),
  conversationId: z.string().max(64).optional(),
});

export class AssistantController {
  async chat(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, conversationId } = req.body as z.infer<typeof chatSchema>;
      const agentResponse = await assistantService.handleChatMessage(message, {
        conversationId,
        userId: req.userId,
      });
      sendSuccess(res, agentResponse, "AI Assistant response generated");
    } catch (err) {
      next(err);
    }
  }

  async recommend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, budget, query } = req.body;
      const result = await recommendationService.getRecommendations(category, budget, query);
      sendSuccess(res, result, "Recommendations generated successfully");
    } catch (err) {
      next(err);
    }
  }

  async compare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productIds } = req.body;
      if (!Array.isArray(productIds) || productIds.length === 0) {
        sendError(res, "productIds array is required for comparison", null, 400);
        return;
      }
      const result = await recommendationService.compareProducts(productIds);
      sendSuccess(res, result, "Comparison generated successfully");
    } catch (err) {
      next(err);
    }
  }
}

export const assistantController = new AssistantController();
