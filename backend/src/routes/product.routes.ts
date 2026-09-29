import { Router } from "express";
import { productController } from "../controllers/product.controller.js";

export const productRouter = Router();

productRouter.get("/", (req, res, next) => productController.getProducts(req, res, next));
productRouter.get("/search", (req, res, next) => productController.search(req, res, next));
productRouter.get("/:id", (req, res, next) => productController.getProductById(req, res, next));
