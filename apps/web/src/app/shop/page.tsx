"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCatalog } from "@/hooks/useCatalog";
import { ProductFilterState } from "@/types/product";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import { Sparkles } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const products = useCatalog();
  const initialCategory = searchParams.get("cat");
  const initialQuery = searchParams.get("q") || "";

  // Normalize initial category slug if present
  const resolvedCategory = initialCategory
    ? initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)
    : "All Categories";

  const [filters, setFilters] = useState<ProductFilterState>({
    category: resolvedCategory === "All Categories" ? "All Categories" : resolvedCategory,
    minPrice: 0,
    maxPrice: 250000,
    minRating: 0,
    searchQuery: initialQuery,
    availability: "all",
    sortBy: "featured",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filters.category !== "All Categories") {
        if (product.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }
      }

      // Price filter
      if (product.price > filters.maxPrice || product.price < filters.minPrice) {
        return false;
      }

      // Rating filter
      if (product.rating < filters.minRating) {
        return false;
      }

      // Availability filter
      if (filters.availability === "in-stock" && product.availability !== "in-stock") {
        return false;
      }

      // Search query filter
      if (filters.searchQuery.trim() !== "") {
        const q = filters.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchTag = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchDesc && !matchTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-low") return a.price - b.price;
      if (filters.sortBy === "price-high") return b.price - a.price;
      if (filters.sortBy === "rating") return b.rating - a.rating;
      if (filters.sortBy === "popularity") return b.reviewCount - a.reviewCount;
      return (b.matchScore || 90) - (a.matchScore || 90);
    });
  }, [products, filters]);

  const handleResetFilters = () => {
    setFilters({
      category: "All Categories",
      minPrice: 0,
      maxPrice: 250000,
      minRating: 0,
      searchQuery: "",
      availability: "all",
      sortBy: "featured",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Shop Header */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Tech Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Explore Products
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Filter by budget, brand, ratings or ask our AI assistant to shortlist items for you.
        </p>
      </div>

      {/* Filter Toolbar */}
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        totalResults={filteredProducts.length}
      />

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-zinc-400 text-sm">
          Loading ShopMind AI Catalog...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
