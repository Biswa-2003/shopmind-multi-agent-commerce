import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { AuthSession } from "@/types/user";

/**
 * Stores the session, then merges anything the guest added to their cart/wishlist
 * into the account and loads the saved account copy.
 */
export async function completeLogin(session: AuthSession): Promise<void> {
  useAuthStore.getState().setSession(session.token, session.user);

  const guestCart = useCartStore.getState().items.map((i) => ({ productId: i.product.id, quantity: i.quantity }));
  const guestWishlist = useWishlistStore.getState().items.map((p) => p.id);

  const [cart, wishlist] = await Promise.all([
    guestCart.length > 0 ? api.cart.merge(guestCart) : api.cart.get(),
    guestWishlist.length > 0 ? api.wishlist.merge(guestWishlist) : api.wishlist.get(),
  ]);
  useCartStore.getState().setFromServer(cart);
  useWishlistStore.getState().setFromServer(wishlist);
}

/** Ends the session and clears this browser's copy of the cart/wishlist. Server data is kept. */
export function logout(): void {
  useAuthStore.getState().clearSession();
  useCartStore.getState().resetLocal();
  useWishlistStore.getState().resetLocal();
}

/** Re-validates a stored session and pulls the latest account data (e.g. changes made on another device). */
export async function refreshSession(): Promise<void> {
  if (!useAuthStore.getState().token) return;
  try {
    const [user, cart, wishlist] = await Promise.all([api.auth.me(), api.cart.get(), api.wishlist.get()]);
    useAuthStore.getState().setUser(user);
    useCartStore.getState().setFromServer(cart);
    useWishlistStore.getState().setFromServer(wishlist);
  } catch {
    // 401 already cleared the session via the API interceptor; network errors keep the cached state
  }
}
