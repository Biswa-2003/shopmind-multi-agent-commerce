"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const imageSrc = product.image || product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-sm">
      {/* Product Information */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-800">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {product.brand}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
          >
            {product.name}
          </Link>
          <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {formatINR(product.price)}
          </div>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-sm"
          >
            -
          </button>
          <span className="px-2.5 py-1 text-xs font-bold min-w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-sm"
          >
            +
          </button>
        </div>

        {/* Row Subtotal */}
        <div className="text-sm font-extrabold text-zinc-900 dark:text-white min-w-24 text-right">
          {formatINR(product.price * quantity)}
        </div>

        {/* Delete button */}
        <button
          onClick={() => removeItem(product.id)}
          className="p-2 text-zinc-400 hover:text-rose-500 rounded-xl transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
