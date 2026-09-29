import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Server-side catalog loader. Reads products from the backend (PostgreSQL), refreshed every 60s.
 * Falls back to the bundled catalog when the API is unreachable (e.g. during a build without the backend).
 */
export async function fetchCatalog(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data) && json.data.length > 0) {
        return json.data as Product[];
      }
    }
  } catch {
    // Backend unavailable: use bundled catalog below
  }
  return PRODUCTS;
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  return (await fetchCatalog()).find((p) => p.id === id);
}
