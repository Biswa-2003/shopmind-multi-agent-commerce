import { productService } from "../services/product.service.js";
import { Product } from "../types/product.types.js";

const STOP_WORDS = new Set([
  "suggest", "the", "best", "for", "me", "a", "an", "under", "show", "recommend",
  "which", "is", "are", "with", "good", "great", "top", "i", "need", "want", "find",
  "buy", "please", "can", "you", "give", "looking", "in", "to", "of", "and", "some",
  "below", "within", "budget", "around", "rs", "inr", "lakh", "thousand",
]);

const TAG_BOOST = 6;

export class ProductSearchAgent {
  /**
   * Filters by category and budget, then ranks by keyword relevance.
   * Requirement tags (e.g. "coding") boost matching products rather than excluding the rest.
   */
  async search(params: {
    category?: string;
    budget?: number;
    query?: string;
    tags?: string[];
    catalog?: Product[];
  }): Promise<Product[]> {
    const catalog = params.catalog ?? (await productService.getAllProducts());
    let results = [...catalog];

    if (params.category) {
      results = results.filter(
        (p) => p.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params.budget) {
      results = results.filter((p) => p.price <= params.budget!);
    }

    // Extract keywords by stripping punctuation, numbers and stop words
    const words = (params.query ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+k?$/.test(w));
    const tags = (params.tags ?? []).map((t) => t.toLowerCase());

    if (words.length > 0 || tags.length > 0) {
      const scored = results.map((product) => {
        let score = 0;
        const productTags = product.tags.map((t) => t.toLowerCase());
        const searchable = [
          product.name,
          product.brand,
          product.description,
          ...product.tags,
          ...product.features,
        ].join(" ").toLowerCase();

        for (const word of words) {
          if (product.name.toLowerCase().includes(word)) score += 10;
          if (product.brand.toLowerCase().includes(word)) score += 8;
          if (productTags.includes(word)) score += 7;
          if (product.features.some((f) => f.toLowerCase().includes(word))) score += 5;
          if (searchable.includes(word)) score += 3;
        }
        for (const tag of tags) {
          if (productTags.includes(tag)) score += TAG_BOOST;
        }

        return { product, score };
      });

      // If any matched, return those by relevance (then rating)
      const matched = scored.filter((s) => s.score > 0);
      if (matched.length > 0) {
        matched.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);
        return matched.map((s) => s.product);
      }
    }

    // Nothing specific matched: best overall picks first
    results.sort((a, b) => (b.matchScore || 90) - (a.matchScore || 90));

    return results;
  }
}

export const productSearchAgent = new ProductSearchAgent();
