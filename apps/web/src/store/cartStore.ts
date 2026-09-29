import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";
import { CartItem, CartSummary } from "@/types/cart";
import { api, ServerCart } from "@/lib/api";
import { useAuthStore } from "./authStore";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSummary: () => CartSummary;
  /** Replace local items with the server's copy (used after login/sync). */
  setFromServer: (cart: ServerCart) => void;
  /** Clear the local copy only, e.g. on logout. Does not touch the server. */
  resetLocal: () => void;
}

const isLoggedIn = () => Boolean(useAuthStore.getState().token);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      // Applies a server mutation for logged-in users; local state was already updated optimistically.
      const syncToServer = (request: () => Promise<ServerCart>) => {
        if (!isLoggedIn()) return;
        request()
          .then((cart) => get().setFromServer(cart))
          .catch(() => {
            // Roll back to whatever the server actually has
            api.cart.get().then((cart) => get().setFromServer(cart)).catch(() => {});
          });
      };

      return {
        items: [],

        addItem: (product: Product, quantity = 1) => {
          const currentItems = get().items;
          const existingIndex = currentItems.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updated = [...currentItems];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            set({ items: updated });
          } else {
            set({ items: [...currentItems, { product, quantity }] });
          }
          syncToServer(() => api.cart.add(product.id, quantity));
        },

        removeItem: (productId: string) => {
          set({
            items: get().items.filter((item) => item.product.id !== productId),
          });
          syncToServer(() => api.cart.remove(productId));
        },

        updateQuantity: (productId: string, quantity: number) => {
          if (quantity <= 0) {
            get().removeItem(productId);
            return;
          }
          set({
            items: get().items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          });
          syncToServer(() => api.cart.setQuantity(productId, quantity));
        },

        clearCart: () => {
          set({ items: [] });
          syncToServer(() => api.cart.clear());
        },

        setFromServer: (cart: ServerCart) => {
          set({ items: cart.items.map((i) => ({ product: i.product, quantity: i.quantity })) });
        },

        resetLocal: () => {
          set({ items: [] });
        },

        // Keep in sync with backend/src/services/pricing.ts (the server recomputes totals at checkout)
        getSummary: () => {
          const items = get().items;
          const subtotal = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          // Free delivery over ₹1,000, else ₹150
          const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 150;
          // AI VIP Coupon / discount: ₹1,500 off orders over ₹30,000
          const discount = subtotal > 30000 ? 1500 : 0;
          // 18% GST estimate
          const tax = Math.round(subtotal * 0.18);
          const total = Math.max(0, subtotal + deliveryFee + tax - discount);
          const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

          return {
            subtotal,
            deliveryFee,
            discount,
            tax,
            total,
            totalItems,
          };
        },
      };
    },
    {
      name: "shopmind_cart_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
