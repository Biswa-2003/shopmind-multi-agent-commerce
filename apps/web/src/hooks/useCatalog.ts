"use client";

import { useEffect, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { api } from "@/lib/api";

// Shared across components so the catalog is requested once per page load
let catalogRequest: Promise<Product[] | null> | null = null;

function loadCatalog(): Promise<Product[] | null> {
  if (!catalogRequest) {
    catalogRequest = api.getProducts().then((res) => {
      const data = res?.data;
      if (Array.isArray(data) && data.length > 0) return data as Product[];
      catalogRequest = null; // allow a retry on next mount
      return null;
    });
  }
  return catalogRequest;
}

/**
 * Client-side catalog. Renders the bundled catalog immediately, then swaps in the
 * live catalog from the backend once it loads.
 */
export function useCatalog(): Product[] {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let cancelled = false;
    loadCatalog().then((live) => {
      if (live && !cancelled) setProducts(live);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}
