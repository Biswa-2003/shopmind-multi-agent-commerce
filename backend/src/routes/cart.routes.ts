import { Router } from "express";
import {
  addCartItemSchema,
  cartController,
  mergeCartSchema,
  updateCartItemSchema,
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";

export const cartRouter = Router();

cartRouter.use(requireAuth);

cartRouter.get("/", (req, res, next) => cartController.getCart(req, res, next));
cartRouter.delete("/", (req, res, next) => cartController.clear(req, res, next));
cartRouter.post("/merge", validateBody(mergeCartSchema), (req, res, next) => cartController.merge(req, res, next));
cartRouter.post("/items", validateBody(addCartItemSchema), (req, res, next) => cartController.addItem(req, res, next));
cartRouter.patch("/items/:productId", validateBody(updateCartItemSchema), (req, res, next) =>
  cartController.updateItem(req, res, next)
);
cartRouter.delete("/items/:productId", (req, res, next) => cartController.removeItem(req, res, next));
