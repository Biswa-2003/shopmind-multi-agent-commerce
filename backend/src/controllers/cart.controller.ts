import { Response, NextFunction } from "express";
import { z } from "zod";
import { cartService, MAX_QUANTITY_PER_ITEM } from "../services/cart.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { sendSuccess } from "../utils/response.js";

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(MAX_QUANTITY_PER_ITEM),
});

export const mergeCartSchema = z.object({
  items: z
    .array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM) }))
    .max(100),
});

export class CartController {
  async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await cartService.getCart(req.userId!), "Cart retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity } = req.body as z.infer<typeof addCartItemSchema>;
      sendSuccess(res, await cartService.addItem(req.userId!, productId, quantity), "Item added to cart");
    } catch (err) {
      next(err);
    }
  }

  async updateItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quantity } = req.body as z.infer<typeof updateCartItemSchema>;
      sendSuccess(res, await cartService.setQuantity(req.userId!, String(req.params.productId), quantity), "Cart updated");
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await cartService.removeItem(req.userId!, String(req.params.productId)), "Item removed from cart");
    } catch (err) {
      next(err);
    }
  }

  async clear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await cartService.clear(req.userId!), "Cart cleared");
    } catch (err) {
      next(err);
    }
  }

  async merge(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items } = req.body as z.infer<typeof mergeCartSchema>;
      sendSuccess(res, await cartService.merge(req.userId!, items), "Cart merged");
    } catch (err) {
      next(err);
    }
  }
}

export const cartController = new CartController();
