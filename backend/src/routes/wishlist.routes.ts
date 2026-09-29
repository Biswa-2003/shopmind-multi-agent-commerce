import { Router } from "express";
import { addWishlistItemSchema, mergeWishlistSchema, wishlistController } from "../controllers/wishlist.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";

export const wishlistRouter = Router();

wishlistRouter.use(requireAuth);

wishlistRouter.get("/", (req, res, next) => wishlistController.getWishlist(req, res, next));
wishlistRouter.delete("/", (req, res, next) => wishlistController.clear(req, res, next));
wishlistRouter.post("/merge", validateBody(mergeWishlistSchema), (req, res, next) =>
  wishlistController.merge(req, res, next)
);
wishlistRouter.post("/items", validateBody(addWishlistItemSchema), (req, res, next) =>
  wishlistController.addItem(req, res, next)
);
wishlistRouter.delete("/items/:productId", (req, res, next) => wishlistController.removeItem(req, res, next));
