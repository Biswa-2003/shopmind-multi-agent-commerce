import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, minPrice, maxPrice, minRating, search, availability, sortBy } = req.query;

      const products = await productService.getProducts({
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        search: search as string,
        availability: availability as "in-stock" | "out-of-stock" | "all",
        sortBy: sortBy as "featured" | "price-low" | "price-high" | "rating" | "popularity",
      });

      sendSuccess(res, products, "Products fetched successfully");
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const product = await productService.getProductById(id);
      if (!product) {
        sendError(res, "Product not found", null, 404);
        return;
      }
      sendSuccess(res, product, "Product details retrieved");
    } catch (err) {
      next(err);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || "";
      const products = await productService.searchProducts(q);
      sendSuccess(res, products, "Search results fetched successfully");
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
