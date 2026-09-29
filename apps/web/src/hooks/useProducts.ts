"use client";

import { useState, useMemo } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { ProductFilterState } from "@/types/product";

export function useProducts() {
  const products = useCatalog();
  const [filters, setFilters] = useState<ProductFilterState>({
    category: "All Categories",
    minPrice: 0,
    maxPrice: 250000,
    minRating: 0,
    searchQuery: "",
    availability: "all",
    sortBy: "featured",
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (
          filters.category !== "All Categories" &&
          product.category !== filters.category
        ) {
          return false;
        }

        // Price filter
        if (product.price < filters.minPrice || product.price > filters.maxPrice) {
          return false;
        }

        // Rating filter
        if (product.rating < filters.minRating) {
          return false;
        }

        // Availability filter
        if (filters.availability && filters.availability !== "all") {
          if (product.availability !== filters.availability) {
            return false;
          }
        }

        // Search query filter
        if (filters.searchQuery.trim() !== "") {
          const q = filters.searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchTag = product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTag) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price-low") return a.price - b.price;
        if (filters.sortBy === "price-high") return b.price - a.price;
        if (filters.sortBy === "rating") return b.rating - a.rating;
        return (b.matchScore || 0) - (a.matchScore || 0);
      });
  }, [products, filters]);

  return {
    products: filteredProducts,
    allProducts: products,
    filters,
    setFilters,
  };
}
