"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatINR } from "@/lib/utils";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, isHydrated } = useWishlist();
  const { addItem } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-zinc-400 text-sm">
        Loading wishlist...
      </div>
    );
  }

  const handleMoveToCart = (product: typeof items[0]) => {
    addItem(product, 1);
    removeItem(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            My Wishlist
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {items.length} {items.length === 1 ? "product" : "products"} saved for later
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear Wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="Your wishlist is empty"
          description="Save smart gadgets, phones, and laptops you're interested in to review them anytime."
          actionText="Discover Products"
          actionHref="/shop"
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="flex flex-col rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-all p-4"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 block mb-3"
                >
                  <Image
                    src={product.image || product.images?.[0] || ""}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {product.brand}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-bold text-sm text-zinc-900 dark:text-white hover:text-indigo-600 line-clamp-1 block"
                    >
                      {product.name}
                    </Link>
                    <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                      {formatINR(product.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Move to Cart
                    </button>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
