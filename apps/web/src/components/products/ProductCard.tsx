"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Scale, Check, Sparkles } from "lucide-react";
import { Product } from "@/types/product";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductRating } from "./ProductRating";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const discount = product.discount || calculateDiscount(product.originalPrice, product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
  };

  const mainImage = product.image || product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

  return (
    <div className="group relative flex flex-col rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 overflow-hidden hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300">
      {/* Product Image & Badges */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 block"
      >
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* AI Match Badge */}
        {product.matchScore && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
            <Sparkles className="w-3 h-3 text-indigo-200" />
            <span>{product.matchScore}% Match</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-12 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-bold shadow-md">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            inWishlist
              ? "bg-rose-50 text-rose-500 shadow-md"
              : "bg-white/80 dark:bg-zinc-900/80 text-zinc-500 hover:text-rose-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500" : ""}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {product.brand}
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">
            {product.category}
          </span>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="font-bold text-zinc-900 dark:text-white text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating and Reviews */}
        <div className="mt-3">
          <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <div>
            <div className="text-lg font-extrabold text-zinc-900 dark:text-white">
              {formatINR(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-zinc-400 line-through">
                {formatINR(product.originalPrice)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/compare?p=${product.id}`}
              className="p-2 rounded-xl text-zinc-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-zinc-200 dark:border-zinc-800 transition-colors"
              title="Compare this product"
            >
              <Scale className="w-4 h-4" />
            </Link>

            <button
              id={`btn-cart-${product.id}`}
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
