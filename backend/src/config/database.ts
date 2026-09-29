import { PrismaClient } from "@prisma/client";
import { ENV } from "./env.js";
import { logger } from "../utils/logger.js";

export const prisma = new PrismaClient({
  log: ENV.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

export async function initDatabase(): Promise<void> {
  if (!ENV.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy backend/.env.example to backend/.env and fill it in.");
  }
  await prisma.$connect();
  const productCount = await prisma.product.count();
  logger.info(`Connected to PostgreSQL (${productCount} products in catalog)`);
  if (productCount === 0) {
    logger.warn("Product catalog is empty. Run: npm run db:seed --workspace=backend");
  }
}

export async function closeDatabase(): Promise<void> {
  await prisma.$disconnect();
}
