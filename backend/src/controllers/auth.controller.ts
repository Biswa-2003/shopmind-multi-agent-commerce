import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authService } from "../services/auth.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { sendSuccess } from "../utils/response.js";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body as z.infer<typeof registerSchema>;
      const result = await authService.register(name, email, password);
      sendSuccess(res, result, "Account created successfully", 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as z.infer<typeof loginSchema>;
      const result = await authService.login(email, password);
      sendSuccess(res, result, "Logged in successfully");
    } catch (err) {
      next(err);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getUser(req.userId!);
      sendSuccess(res, user, "Current user retrieved");
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
