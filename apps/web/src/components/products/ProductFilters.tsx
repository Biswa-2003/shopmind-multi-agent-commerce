"use client";

import React, { useState } from "react";
import { ProductFilterState } from "@/types/product";
import { CATEGORIES } from "@/data/categories";
import { formatINR } from "@/lib/utils";
import { Search, SlidersHorizontal, RotateCcw, X } from "lucide-react";

interface ProductFiltersProps {
  filters: ProductFilterState;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilterState>>;
  totalResults: number;
}

export default function ProductFilters({
  filters,
  setFilters,
  totalResults,
}: ProductFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categoryList = ["All Categories", ...CATEGORIES.map((c) => c.name)];

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handlePriceChange = (maxPrice: number) => {
    setFilters((prev) => ({ ...prev, maxPrice }));
  };

  const resetFilters = () => {
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

  const FilterPanelContent = () => (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
          Categories
        </h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {categoryList.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{cat}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Budget Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="uppercase tracking-wider text-zinc-900 dark:text-white">
            Max Budget
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
            {formatINR(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="250000"
          step="5000"
          value={filters.maxPrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
          <span>₹5,000</span>
          <span>₹2,50,000</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">
          Customer Rating
        </h4>
        <div className="flex flex-wrap gap-2">
          {[0, 4.0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilters((prev) => ({ ...prev, minRating: rating }))}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                filters.minRating === rating
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
              }`}
            >
              {rating === 0 ? "Any" : `${rating}★ & above`}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">
          Availability
        </h4>
        <div className="flex gap-2">
          {(["all", "in-stock"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilters((prev) => ({ ...prev, availability: status }))}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border capitalize transition-all ${
                filters.availability === status
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {status === "all" ? "All Items" : "In Stock Only"}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Sort Top Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="Search laptops, phones, specs..."
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 hidden sm:inline">Sort by:</span>
            <select
              id="filter-sort-select"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as ProductFilterState["sortBy"],
                }))
              }
              aria-label="Sort products"
              className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="featured">AI Match / Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count and Active Category Chips */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pb-2">
        <span>Showing {totalResults} products</span>
        {filters.category !== "All Categories" && (
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Category: {filters.category}
          </span>
        )}
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="relative w-4/5 max-w-sm ml-auto h-full bg-white dark:bg-zinc-900 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Filter Catalog
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanelContent />
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md"
              >
                Apply Filters ({totalResults} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
