import { Response, NextFunction } from "express";
import { z } from "zod";
import { orderService } from "../services/order.service.js";
import { MAX_QUANTITY_PER_ITEM } from "../services/cart.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { sendSuccess } from "../utils/response.js";

export const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM) }))
    .min(1, "Your cart is empty")
    .max(100),
  paymentMethod: z.enum(["online", "cod"]).default("cod"),
});

export class OrderController {
  async checkout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items, paymentMethod } = req.body as z.infer<typeof checkoutSchema>;
      sendSuccess(res, await orderService.checkout(req.userId!, items, paymentMethod), "Order placed successfully", 201);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await orderService.listOrders(req.userId!), "Orders retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async get(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await orderService.getOrder(req.userId!, String(req.params.id)), "Order retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async cancel(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await orderService.cancelByCustomer(req.userId!, String(req.params.id)), "Order cancelled");
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
