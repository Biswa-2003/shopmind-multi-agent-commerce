import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Operation successful",
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message = "Something went wrong",
  error: unknown = null,
  statusCode = 500
): void {
  res.status(statusCode).json({
    success: false,
    message,
    error: error instanceof Error ? error.message : error || message,
  });
}
