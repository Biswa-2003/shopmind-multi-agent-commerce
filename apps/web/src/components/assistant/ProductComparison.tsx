"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

interface ProductComparisonProps {
  products: Product[];
}

const MAX_SPEC_ROWS = 6;

/** Spec names every compared product has, so each row compares like with like. */
function sharedSpecKeys(products: Product[]): string[] {
  const [first, ...rest] = products;
  return Object.keys(first.specifications ?? {})
    .filter((key) => rest.every((p) => p.specifications?.[key]))
    .slice(0, MAX_SPEC_ROWS);
}

export function ProductComparison({ products }: ProductComparisonProps) {
  const { addItem } = useCart();

  if (!products || products.length < 2) return null;

  const specKeys = sharedSpecKeys(products);
  const cheapest = Math.min(...products.map((p) => p.price));
  const bestRated = Math.max(...products.map((p) => p.rating));

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    {
      label: "Price",
      render: (p) => (
        <span className={p.price === cheapest ? "font-bold text-emerald-600 dark:text-emerald-400" : "font-semibold"}>
          {formatINR(p.price)}
          {p.price === cheapest && <span className="block text-[10px] font-semibold">Lowest price</span>}
        </span>
      ),
    },
    {
      label: "Rating",
      render: (p) => (
        <span className={p.rating === bestRated ? "font-bold text-amber-500" : "text-zinc-700 dark:text-zinc-300"}>
          {p.rating}★ <span className="text-zinc-400 font-normal">({p.reviewCount.toLocaleString("en-IN")})</span>
        </span>
      ),
    },
    ...specKeys.map((key) => ({ label: key, render: (p: Product) => p.specifications[key] })),
    { label: "Strength", render: (p: Product) => p.aiPros?.[0] ?? "—" },
    { label: "Watch out", render: (p: Product) => p.aiCons?.[0] ?? "—" },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
            <th className="p-2 sm:p-3 w-16 sm:w-24 font-semibold text-zinc-400 align-bottom">Compare</th>
            {products.map((p) => (
              <th key={p.id} className="p-2 sm:p-3 min-w-[118px] sm:min-w-[150px] align-top font-normal">
                <div className="space-y-2">
                  <div className="relative h-20 sm:h-24 w-full max-w-[160px] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image src={p.image || p.images?.[0] || ""} alt={p.name} fill sizes="200px" className="object-cover" />
                  </div>
                  <Link href={`/products/${p.id}`} className="block font-bold text-zinc-900 dark:text-white line-clamp-2 hover:underline">
                    {p.name}
                  </Link>
                  <button
                    onClick={() => addItem(p, 1)}
                    disabled={p.availability !== "in-stock"}
                    className="w-full max-w-[160px] flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] cursor-pointer disabled:bg-zinc-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    {p.availability === "in-stock" ? "Add to cart" : "Out of stock"}
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="p-2 sm:p-2.5 font-semibold text-zinc-500 align-top">{row.label}</td>
              {products.map((p) => (
                <td key={p.id} className="p-2 sm:p-2.5 text-zinc-700 dark:text-zinc-300 align-top break-words">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
