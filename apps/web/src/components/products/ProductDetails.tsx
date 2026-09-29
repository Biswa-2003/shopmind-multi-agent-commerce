"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductGallery } from "./ProductGallery";
import { ProductRating } from "./ProductRating";
import ProductCard from "./ProductCard";
import {
  ShoppingCart,
  Zap,
  Heart,
  Scale,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bot,
} from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = product.discount || calculateDiscount(product.originalPrice, product.price);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/cart");
  };

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-indigo-600">Shop</Link>
        <span>/</span>
        <Link href={`/shop?cat=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 truncate max-w-xs font-medium">
          {product.name}
        </span>
      </nav>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery Column */}
        <ProductGallery
          images={galleryImages}
          name={product.name}
          matchScore={product.matchScore}
        />

        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {product.brand} • {product.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleItem(product)}
                  aria-label="Wishlist"
                  className={`p-2 rounded-xl border transition-all ${
                    inWishlist
                      ? "bg-rose-50 text-rose-500 border-rose-200"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500" : ""}`} />
                </button>

                <Link
                  href={`/compare?p=${product.id}`}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-purple-600 transition-colors"
                  title="Compare"
                >
                  <Scale className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <div className="mt-3">
              <ProductRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-zinc-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* AI Synthesis Box */}
          {(product.aiPros || product.aiCons) && (
            <div className="p-5 rounded-3xl border border-indigo-100 dark:border-indigo-950/50 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>ShopMind AI Spec & Sentiment Analysis</span>
              </div>

              {product.aiPros && product.aiPros.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Why buyers love it:
                  </span>
                  {product.aiPros.map((pro, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              )}

              {product.aiCons && product.aiCons.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-indigo-100/60 dark:border-indigo-900/30">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Considerations:
                  </span>
                  {product.aiCons.map((con, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {product.description}
          </p>

          {/* Key Features List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">
              Key Highlights
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700 dark:text-zinc-300">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  -
                </button>
                <span className="px-3 py-2.5 font-bold text-sm min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                id="btn-details-add-to-cart"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm text-white shadow-md transition-all ${
                  added
                    ? "bg-emerald-600"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-1.5 py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-sm transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Buy Now
              </button>
            </div>

            {/* Ask AI CTA */}
            <Link
              href={`/assistant?prompt=${encodeURIComponent(
                `Tell me everything about ${product.name} and if it is worth buying for my workflow.`
              )}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100/70 transition-colors"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              Ask ShopMind AI Questions About This Product
            </Link>
          </div>

          {/* Trust Assurances */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                Express Delivery
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                100% Genuine
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                7-Day Replacement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="space-y-6 pt-12 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Technical Specifications
        </h2>
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/50 dark:bg-zinc-900/50"
            >
              <span className="font-semibold text-zinc-500 w-1/3">{key}</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-200 flex-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Is this item brand new with full manufacturer warranty?
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              Yes, all products shipped on ShopMind AI are 100% brand-new, sealed units backed by official manufacturer warranties across India.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              How does ShopMind AI verify reviews and specs?
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              Our autonomous Review Analysis Agent aggregates telemetry from verified buyers, filtering out sponsored reviews to provide realistic pros, cons, and durability ratings.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Similar Products You Might Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
