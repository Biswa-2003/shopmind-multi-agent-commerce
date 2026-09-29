"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { useCartStore } from "@/store/cartStore";

export function useCart() {
  const hydrated = useHydrated();
  const store = useCartStore();

  return {
    items: hydrated ? store.items : [],
    summary: hydrated
      ? store.getSummary()
      : { subtotal: 0, deliveryFee: 0, discount: 0, tax: 0, total: 0, totalItems: 0 },
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    isHydrated: hydrated,
  };
}
