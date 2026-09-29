import { Product } from "./product";

export interface OrderItem {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  product: Product;
}

export type PaymentMethod = "online" | "cod";

/** pending_payment -> paid | confirmed (COD) -> cancelled */
export type OrderStatus = "pending_payment" | "paid" | "confirmed" | "cancelled" | string;

export interface Order {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  cancelReason: string | null;
  /** Unpaid online orders are cancelled automatically after this time. */
  payBy: string | null;
  payment: { status: string; method: string | null; gateway: string } | null;
  trackingNumber: string | null;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}
