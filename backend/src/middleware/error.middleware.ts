import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { sendError } from "../utils/response.js";
import { HttpError } from "../utils/http-error.js";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    sendError(res, err.message, err.details, err.status);
    return;
  }

  logger.error(`Unhandled exception on ${req.method} ${req.url}:`, err);
  sendError(
    res,
    "An internal server error occurred",
    ENV.NODE_ENV === "production" ? null : err.message,
    500
  );
}
