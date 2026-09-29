import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types/product";
import { AuthSession, User } from "@/types/user";
import { Order, PaymentMethod } from "@/types/order";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // A rejected token means the session is over (expired, or user deleted)
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);

/** Turns an API/network error into a message suitable for showing to the user. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return "Can't reach the ShopMind server. Check that the backend is running.";
    const body = err.response.data as { message?: string; error?: unknown } | undefined;
    // Zod validation errors: show the first field message
    if (Array.isArray(body?.error) && body.error[0]?.message) return body.error[0].message;
    if (body?.message) return body.message;
  }
  return fallback;
}

export interface ServerCartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface ServerCart {
  items: ServerCartItem[];
}

export interface ServerWishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: Product;
}

export const api = {
  getProducts: async (params?: Record<string, unknown>) => {
    try {
      const response = await apiClient.get("/products", { params });
      return response.data;
    } catch {
      // Fallback gracefully if backend service is not running yet
      return null;
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  sendChatMessage: async (message: string, conversationId?: string) => {
    try {
      const response = await apiClient.post("/assistant/chat", {
        message,
        conversationId,
      });
      return response.data;
    } catch {
      return null;
    }
  },

  // The calls below throw on failure; use getErrorMessage() to display the reason.
  auth: {
    register: async (name: string, email: string, password: string): Promise<AuthSession> =>
      (await apiClient.post("/auth/register", { name, email, password })).data.data,
    login: async (email: string, password: string): Promise<AuthSession> =>
      (await apiClient.post("/auth/login", { email, password })).data.data,
    me: async (): Promise<User> => (await apiClient.get("/auth/me")).data.data,
  },

  cart: {
    get: async (): Promise<ServerCart> => (await apiClient.get("/cart")).data.data,
    add: async (productId: string, quantity: number): Promise<ServerCart> =>
      (await apiClient.post("/cart/items", { productId, quantity })).data.data,
    setQuantity: async (productId: string, quantity: number): Promise<ServerCart> =>
      (await apiClient.patch(`/cart/items/${encodeURIComponent(productId)}`, { quantity })).data.data,
    remove: async (productId: string): Promise<ServerCart> =>
      (await apiClient.delete(`/cart/items/${encodeURIComponent(productId)}`)).data.data,
    clear: async (): Promise<ServerCart> => (await apiClient.delete("/cart")).data.data,
    merge: async (items: { productId: string; quantity: number }[]): Promise<ServerCart> =>
      (await apiClient.post("/cart/merge", { items })).data.data,
  },

  wishlist: {
    get: async (): Promise<ServerWishlistItem[]> => (await apiClient.get("/wishlist")).data.data,
    add: async (productId: string): Promise<ServerWishlistItem[]> =>
      (await apiClient.post("/wishlist/items", { productId })).data.data,
    remove: async (productId: string): Promise<ServerWishlistItem[]> =>
      (await apiClient.delete(`/wishlist/items/${encodeURIComponent(productId)}`)).data.data,
    clear: async (): Promise<ServerWishlistItem[]> => (await apiClient.delete("/wishlist")).data.data,
    merge: async (productIds: string[]): Promise<ServerWishlistItem[]> =>
      (await apiClient.post("/wishlist/merge", { productIds })).data.data,
  },

  orders: {
    list: async (): Promise<Order[]> => (await apiClient.get("/orders")).data.data,
    get: async (id: string): Promise<Order> => (await apiClient.get(`/orders/${encodeURIComponent(id)}`)).data.data,
    checkout: async (items: { productId: string; quantity: number }[], paymentMethod: PaymentMethod): Promise<Order> =>
      (await apiClient.post("/orders", { items, paymentMethod })).data.data,
    cancel: async (id: string): Promise<Order> =>
      (await apiClient.post(`/orders/${encodeURIComponent(id)}/cancel`)).data.data,
  },

  payments: {
    config: async (): Promise<PaymentConfig> => (await apiClient.get("/payments/config")).data.data,
    initiate: async (orderId: string): Promise<PaymentSession> =>
      (await apiClient.post(`/payments/${encodeURIComponent(orderId)}/initiate`)).data.data,
    verify: async (body: {
      orderId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }): Promise<Order> => (await apiClient.post("/payments/verify", body)).data.data,
    completeMock: async (orderId: string, outcome: "success" | "failure"): Promise<Order> =>
      (await apiClient.post("/payments/mock/complete", { orderId, outcome })).data.data,
  },
};

export interface PaymentConfig {
  gateway: "razorpay" | "mock" | null;
  keyId: string | null;
}

export interface PaymentSession {
  gateway: "razorpay" | "mock";
  keyId: string | null;
  orderId: string;
  gatewayOrderId: string;
  amountPaise: number;
  currency: string;
  prefill: { name: string; email: string };
}
