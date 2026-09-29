import { Router } from "express";
import { mockCompleteSchema, paymentController, verifySchema } from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";

// The webhook route is mounted separately in app.ts because it needs the raw request body.
export const paymentRouter = Router();

paymentRouter.get("/config", (req, res) => paymentController.config(req, res));
paymentRouter.post("/:orderId/initiate", requireAuth, (req, res, next) => paymentController.initiate(req, res, next));
paymentRouter.post("/verify", requireAuth, validateBody(verifySchema), (req, res, next) =>
  paymentController.verify(req, res, next)
);
paymentRouter.post("/mock/complete", requireAuth, validateBody(mockCompleteSchema), (req, res, next) =>
  paymentController.completeMock(req, res, next)
);
