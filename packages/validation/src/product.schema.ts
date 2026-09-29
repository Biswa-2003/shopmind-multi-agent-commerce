import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  category: z.string(),
  rating: z.number().min(0).max(5),
  reviewsCount: z.number().int().min(0),
  inStock: z.boolean(),
  images: z.array(z.string().url()),
  features: z.array(z.string()),
  specs: z.record(z.union([z.string(), z.number(), z.boolean()])),
  aiPros: z.array(z.string()).optional(),
  aiCons: z.array(z.string()).optional(),
  matchScore: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()),
});
