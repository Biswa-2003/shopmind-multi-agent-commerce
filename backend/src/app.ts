import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ENV } from "./config/env.js";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { assistantRouter } from "./routes/assistant.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { wishlistRouter } from "./routes/wishlist.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { paymentController } from "./controllers/payment.controller.js";
import { rateLimit } from "express-rate-limit";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = new Set([ENV.CLIENT_URL, ...ENV.CORS_ORIGINS]);
const LOCALHOST_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isOriginAllowed(origin: string | undefined): boolean {
  // Requests without an Origin header (curl, server-to-server, same-origin) are not subject to CORS
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  return ENV.NODE_ENV === "development" && LOCALHOST_ORIGIN.test(origin);
}

// Security & Utility Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => callback(null, isOriginAllowed(origin)),
    credentials: true,
  })
);
app.use(morgan(ENV.NODE_ENV === "production" ? "combined" : "dev"));

// Razorpay webhook: needs the raw bytes for signature verification, so it's registered before express.json()
app.post("/api/payments/webhook", express.raw({ type: "application/json", limit: "1mb" }), (req, res, next) =>
  paymentController.webhook(req, res, next)
);

app.use(express.json({ limit: "100kb" }));

// Rate limits (per IP, per 15 minutes) on endpoints worth abusing
const limiter = (limit: number) =>
  rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: "draft-8", legacyHeaders: false });

// Base Health Check
app.use("/api/health", healthRouter);

// Domain Routes
// Only credential endpoints are limited (password guessing); /auth/me runs on every page load
app.use(["/api/auth/login", "/api/auth/register"], limiter(ENV.RATE_LIMIT_AUTH));
app.use("/api/auth", authRouter);
app.use("/api/payments", limiter(ENV.RATE_LIMIT_PAYMENTS), paymentRouter);
app.use("/api/products", productRouter);
app.use("/api/assistant", assistantRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", orderRouter);

// Global Error Handler
app.use(errorMiddleware);

export default app;
