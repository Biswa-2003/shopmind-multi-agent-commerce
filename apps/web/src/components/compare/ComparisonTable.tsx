"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Sparkles, CheckCircle, XCircle, Bot, X } from "lucide-react";
import { ProductRating } from "../products/ProductRating";

interface ComparisonTableProps {
  products: Product[];
  initialSelectedId?: string;
}

export function ComparisonTable({ products, initialSelectedId }: ComparisonTableProps) {
  const { addItem } = useCart();
  const defaultSelection = initialSelectedId
    ? [initialSelectedId, ...products.filter((p) => p.id !== initialSelectedId).slice(0, 2).map((p) => p.id)]
    : products.slice(0, 3).map((p) => p.id);

  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelection);

  const activeProducts = products.filter((p) => selectedIds.includes(p.id));

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const removeProduct = (id: string) => {
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const clearAll = () => {
    setSelectedIds(products.slice(0, 2).map((p) => p.id));
  };

  const askAiPrompt = `Compare ${activeProducts.map((p) => p.name).join(" and ")} in detail and tell me the best choice for value and durability.`;

  return (
    <div className="space-y-6">
      {/* Product Selector Ribbon */}
      <div className="p-4 sm:p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Select up to 4 models to compare ({selectedIds.length}/4 selected):
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={`/assistant?prompt=${encodeURIComponent(askAiPrompt)}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Bot className="w-3.5 h-3.5" />
              Ask AI to Analyze This Comparison
            </Link>
            <button
              onClick={clearAll}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {products.map((p) => {
            const isChecked = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProduct(p.id)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  isChecked
                    ? "bg-indigo-600 text-white border-indigo-600 font-semibold shadow-2xs"
                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400"
                }`}
              >
                {isChecked ? "✓ " : "+ "}
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50">
              <th className="p-6 text-xs font-bold text-zinc-400 uppercase tracking-wider w-48 align-top">
                Device / Feature
              </th>
              {activeProducts.map((p) => (
                <th key={p.id} className="p-6 min-w-[220px] align-top">
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={p.image || p.images?.[0] || ""}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                      {p.matchScore && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{p.matchScore}% Match</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black"
                        title="Remove column"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {p.brand}
                      </span>
                      <Link
                        href={`/products/${p.id}`}
                        className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-indigo-600 block line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <div className="text-base sm:text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                        {formatINR(p.price)}
                      </div>
                    </div>

                    <button
                      onClick={() => addItem(p, 1)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs sm:text-sm">
            {/* Category */}
            <tr>
              <td className="p-4 sm:p-5 font-semibold text-zinc-500">Category</td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 font-medium text-zinc-800 dark:text-zinc-200">
                  {p.category}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="bg-zinc-50/40 dark:bg-zinc-950/20">
              <td className="p-4 sm:p-5 font-semibold text-zinc-500">Rating</td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5">
                  <ProductRating rating={p.rating} reviewCount={p.reviewCount} />
                </td>
              ))}
            </tr>

            {/* Availability */}
            <tr>
              <td className="p-4 sm:p-5 font-semibold text-zinc-500">Availability</td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    In Stock (Ready to Dispatch)
                  </span>
                </td>
              ))}
            </tr>

            {/* AI Pros */}
            <tr className="bg-zinc-50/40 dark:bg-zinc-950/20">
              <td className="p-4 sm:p-5 font-semibold text-zinc-500 align-top">Top AI Strength</td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 align-top">
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">
                    {p.aiPros?.[0] || "Exceptional reliability in testing."}
                  </p>
                </td>
              ))}
            </tr>

            {/* AI Cons */}
            <tr>
              <td className="p-4 sm:p-5 font-semibold text-zinc-500 align-top">Considerations</td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 align-top">
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">
                    {p.aiCons?.[0] || "None observed."}
                  </p>
                </td>
              ))}
            </tr>

            {/* Key Features */}
            <tr className="bg-zinc-50/40 dark:bg-zinc-950/20">
              <td className="p-4 sm:p-5 font-semibold text-zinc-500 align-top">Key Features</td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 align-top">
                  <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {p.features.map((feat, i) => (
                      <li key={i}>• {feat}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComparisonTable;
