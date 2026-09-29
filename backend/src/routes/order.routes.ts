import { Router } from "express";
import { checkoutSchema, orderController } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";

export const orderRouter = Router();

orderRouter.use(requireAuth);

orderRouter.get("/", (req, res, next) => orderController.list(req, res, next));
orderRouter.post("/", validateBody(checkoutSchema), (req, res, next) => orderController.checkout(req, res, next));
orderRouter.get("/:id", (req, res, next) => orderController.get(req, res, next));
orderRouter.post("/:id/cancel", (req, res, next) => orderController.cancel(req, res, next));
