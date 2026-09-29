import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const DEV_JWT_SECRET = "dev_only_insecure_jwt_secret";

function intFromEnv(name: string, fallback: number): number {
  const value = parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) ? value : fallback;
}

if (NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  // Comma-separated list of extra origins allowed by CORS (e.g. a deployed frontend)
  CORS_ORIGINS: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  DATABASE_URL: process.env.DATABASE_URL || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GROQ_MODEL: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
  JWT_SECRET: process.env.JWT_SECRET || DEV_JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Payments. PAYMENT_GATEWAY: "razorpay", "mock" (development only) or "auto" (razorpay if keys are set, else mock in development)
  PAYMENT_GATEWAY: (process.env.PAYMENT_GATEWAY || "auto").toLowerCase(),
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  /** Unpaid online orders are cancelled (and their stock released) after this many minutes. */
  PAYMENT_TIMEOUT_MINUTES: intFromEnv("PAYMENT_TIMEOUT_MINUTES", 30),

  // Event processing (outbox -> pg-boss queue -> handlers)
  RUN_WORKERS: process.env.RUN_WORKERS !== "false",
  EVENT_RETRY_LIMIT: intFromEnv("EVENT_RETRY_LIMIT", 5),
  EVENT_RETRY_DELAY_SECONDS: intFromEnv("EVENT_RETRY_DELAY_SECONDS", 5),

  // Email: "console" (log only), "resend", or "failing" (always fails; for testing retries and the DLQ)
  EMAIL_PROVIDER: (process.env.EMAIL_PROVIDER || "console").toLowerCase(),
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "ShopMind AI <orders@example.com>",

  // Requests per IP per 15 minutes
  RATE_LIMIT_AUTH: intFromEnv("RATE_LIMIT_AUTH", 30),
  RATE_LIMIT_PAYMENTS: intFromEnv("RATE_LIMIT_PAYMENTS", 60),
};
