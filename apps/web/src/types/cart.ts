import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  totalItems: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}
