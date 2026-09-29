import { Response, NextFunction } from "express";
import { z } from "zod";
import { wishlistService } from "../services/wishlist.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { sendSuccess } from "../utils/response.js";

export const addWishlistItemSchema = z.object({
  productId: z.string().min(1),
});

export const mergeWishlistSchema = z.object({
  productIds: z.array(z.string().min(1)).max(200),
});

export class WishlistController {
  async getWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await wishlistService.getWishlist(req.userId!), "Wishlist retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.body as z.infer<typeof addWishlistItemSchema>;
      sendSuccess(res, await wishlistService.addItem(req.userId!, productId), "Item added to wishlist");
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(
        res,
        await wishlistService.removeItem(req.userId!, String(req.params.productId)),
        "Item removed from wishlist"
      );
    } catch (err) {
      next(err);
    }
  }

  async clear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await wishlistService.clear(req.userId!), "Wishlist cleared");
    } catch (err) {
      next(err);
    }
  }

  async merge(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productIds } = req.body as z.infer<typeof mergeWishlistSchema>;
      sendSuccess(res, await wishlistService.merge(req.userId!, productIds), "Wishlist merged");
    } catch (err) {
      next(err);
    }
  }
}

export const wishlistController = new WishlistController();
