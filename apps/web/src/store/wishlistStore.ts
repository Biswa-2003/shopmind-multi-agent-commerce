import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";
import { api, ServerWishlistItem } from "@/lib/api";
import { useAuthStore } from "./authStore";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  /** Replace local items with the server's copy (used after login/sync). */
  setFromServer: (items: ServerWishlistItem[]) => void;
  /** Clear the local copy only, e.g. on logout. Does not touch the server. */
  resetLocal: () => void;
}

const isLoggedIn = () => Boolean(useAuthStore.getState().token);

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => {
      // Applies a server mutation for logged-in users; local state was already updated optimistically.
      const syncToServer = (request: () => Promise<ServerWishlistItem[]>) => {
        if (!isLoggedIn()) return;
        request()
          .then((items) => get().setFromServer(items))
          .catch(() => {
            api.wishlist.get().then((items) => get().setFromServer(items)).catch(() => {});
          });
      };

      return {
        items: [],

        addItem: (product: Product) => {
          if (!get().isInWishlist(product.id)) {
            set({ items: [...get().items, product] });
            syncToServer(() => api.wishlist.add(product.id));
          }
        },

        removeItem: (productId: string) => {
          set({
            items: get().items.filter((item) => item.id !== productId),
          });
          syncToServer(() => api.wishlist.remove(productId));
        },

        toggleItem: (product: Product) => {
          if (get().isInWishlist(product.id)) {
            get().removeItem(product.id);
          } else {
            get().addItem(product);
          }
        },

        isInWishlist: (productId: string) => {
          return get().items.some((item) => item.id === productId);
        },

        clearWishlist: () => {
          set({ items: [] });
          syncToServer(() => api.wishlist.clear());
        },

        resetLocal: () => {
          set({ items: [] });
        },

        setFromServer: (items: ServerWishlistItem[]) => {
          set({ items: items.map((i) => i.product) });
        },
      };
    },
    {
      name: "shopmind_wishlist_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
