// Keep in sync with getSummary() in apps/web/src/store/cartStore.ts
export const FREE_DELIVERY_THRESHOLD = 1000;
export const DELIVERY_FEE = 150;
export const VIP_DISCOUNT_THRESHOLD = 30000;
export const VIP_DISCOUNT = 1500;
export const GST_RATE = 0.18;

export interface PriceSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  totalItems: number;
}

export function calculateSummary(lines: { price: number; quantity: number }[]): PriceSummary {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const deliveryFee = subtotal > FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const discount = subtotal > VIP_DISCOUNT_THRESHOLD ? VIP_DISCOUNT : 0;
  const tax = Math.round(subtotal * GST_RATE);
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);
  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
  return { subtotal, deliveryFee, discount, tax, total, totalItems };
}
