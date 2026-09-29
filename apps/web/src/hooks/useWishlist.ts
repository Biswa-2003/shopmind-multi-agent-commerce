"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { useWishlistStore } from "@/store/wishlistStore";

export function useWishlist() {
  const hydrated = useHydrated();
  const store = useWishlistStore();

  return {
    items: hydrated ? store.items : [],
    totalItems: hydrated ? store.items.length : 0,
    addItem: store.addItem,
    removeItem: store.removeItem,
    toggleItem: store.toggleItem,
    isInWishlist: (productId: string) => (hydrated ? store.isInWishlist(productId) : false),
    clearWishlist: store.clearWishlist,
    isHydrated: hydrated,
  };
}
