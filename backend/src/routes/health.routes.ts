import { Router } from "express";
import { prisma } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  let database = "connected";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = "unreachable";
  }

  const payload = {
    service: "ShopMind AI Backend",
    status: database === "connected" ? "healthy" : "degraded",
    database,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  if (database === "connected") {
    sendSuccess(res, payload, "Health check passed");
  } else {
    sendError(res, "Database is unreachable", payload, 503);
  }
});
