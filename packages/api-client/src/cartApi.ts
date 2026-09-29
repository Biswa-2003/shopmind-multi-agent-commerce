import axios from "axios";

export class CartApiClient {
  constructor(private baseUrl: string) {}

  async getCart(cartId?: string) {
    const res = await axios.get(`${this.baseUrl}/cart`, {
      headers: cartId ? { "x-cart-id": cartId } : {},
    });
    return res.data;
  }

  async addToCart(productId: string, quantity: number = 1, cartId?: string) {
    const res = await axios.post(
      `${this.baseUrl}/cart/items`,
      { productId, quantity },
      { headers: cartId ? { "x-cart-id": cartId } : {} }
    );
    return res.data;
  }

  async updateQuantity(productId: string, quantity: number, cartId?: string) {
    const res = await axios.put(
      `${this.baseUrl}/cart/items/${productId}`,
      { quantity },
      { headers: cartId ? { "x-cart-id": cartId } : {} }
    );
    return res.data;
  }

  async clearCart(cartId?: string) {
    const res = await axios.delete(`${this.baseUrl}/cart`, {
      headers: cartId ? { "x-cart-id": cartId } : {},
    });
    return res.data;
  }
}
