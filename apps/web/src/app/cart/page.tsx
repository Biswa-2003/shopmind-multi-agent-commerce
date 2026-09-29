"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import { Trash2, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, summary, clearCart, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-zinc-400 text-sm">
        Loading cart details...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {summary.totalItems} {summary.totalItems === 1 ? "item" : "items"} currently in your bag
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
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

          <div className="lg:col-span-1">
            <CartSummary summary={summary} />
          </div>
        </div>
      )}
    </div>
  );
}
