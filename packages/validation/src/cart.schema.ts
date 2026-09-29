import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const UpdateCartQuantitySchema = z.object({
  quantity: z.number().int().min(0),
});
