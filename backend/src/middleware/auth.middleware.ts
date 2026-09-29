import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { sendError } from "../utils/response.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim() || null;
}

/** Attaches req.userId when a valid token is present; never rejects. */
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (token) {
      const userId = await authService.verifyToken(token);
      if (userId) req.userId = userId;
    }
    next();
  } catch (err) {
    next(err);
  }
}

/** Rejects with 401 unless the request carries a valid token for an existing user. */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      sendError(res, "Authentication token is required to access this resource", null, 401);
      return;
    }
    const userId = await authService.verifyToken(token);
    if (!userId) {
      sendError(res, "Session is invalid or has expired. Please log in again.", null, 401);
      return;
    }
    req.userId = userId;
    next();
  } catch (err) {
    next(err);
  }
}
