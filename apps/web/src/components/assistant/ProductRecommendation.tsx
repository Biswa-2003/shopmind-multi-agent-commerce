"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowUpRight, Check, Star } from "lucide-react";
import { ChatRecommendation } from "@/types/assistant";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface ProductRecommendationProps {
  rec: ChatRecommendation;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

export function ProductRecommendation({ rec }: ProductRecommendationProps) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const { product, reason } = rec;
  const inCart = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
  const outOfStock = product.availability !== "in-stock";

  const handleAddToCart = () => {
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="flex gap-3 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-indigo-400/60 transition-colors">
      <Link
        href={`/products/${product.id}`}
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0"
      >
        <Image src={product.image || product.images?.[0] || FALLBACK_IMAGE} alt={product.name} fill sizes="96px" className="object-cover" />
      </Link>

      <div className="flex flex-col flex-1 min-w-0">
        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-sm text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2 mt-0.5 text-xs">
          <span className="font-extrabold text-zinc-900 dark:text-white">{formatINR(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-zinc-400 line-through">{formatINR(product.originalPrice)}</span>
          )}
          <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
            <Star className="w-3 h-3 fill-current" />
            {product.rating}
            <span className="text-zinc-400 font-normal">({product.reviewCount.toLocaleString("en-IN")})</span>
          </span>
        </div>

        {reason && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{reason}</p>}

        <div className="flex items-center gap-2 mt-auto pt-2">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700 ${
              justAdded ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {justAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {outOfStock ? "Out of stock" : justAdded ? "Added" : inCart ? `In cart (${inCart}) · Add` : "Add to cart"}
          </button>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            Details
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
