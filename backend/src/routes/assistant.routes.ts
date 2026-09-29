import { Router } from "express";
import { assistantController, chatSchema } from "../controllers/assistant.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";

export const assistantRouter = Router();

// Chat works for guests; a valid login token ties the conversation to the user
assistantRouter.post("/chat", optionalAuth, validateBody(chatSchema), (req, res, next) =>
  assistantController.chat(req, res, next)
);
assistantRouter.post("/recommend", (req, res, next) => assistantController.recommend(req, res, next));
assistantRouter.post("/compare", (req, res, next) => assistantController.compare(req, res, next));
