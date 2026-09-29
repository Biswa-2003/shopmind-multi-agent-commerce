import { Router } from "express";
import { authController, loginSchema, registerSchema } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), (req, res, next) => authController.register(req, res, next));
authRouter.post("/login", validateBody(loginSchema), (req, res, next) => authController.login(req, res, next));
authRouter.get("/me", requireAuth, (req, res, next) => authController.me(req, res, next));
