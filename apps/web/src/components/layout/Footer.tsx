import React from "react";
import Link from "next/link";
import { Brain, Heart, Sparkles, Shield, Truck, RotateCcw } from "lucide-react";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-20 transition-colors">
      {/* Guarantees Strip */}
      <div className="border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Fast & Free Delivery
              </h4>
              <p className="text-xs text-zinc-500">Free delivery on orders above ₹1,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Verified Tech Specs
              </h4>
              <p className="text-xs text-zinc-500">100% Genuine manufacturer warranties</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                7-Day Easy Returns
              </h4>
              <p className="text-xs text-zinc-500">Hassle-free doorstep replacement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-extrabold text-xl text-zinc-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Brain className="w-4 h-4" />
              </div>
              <span>{BRAND_NAME}</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              {BRAND_TAGLINE} An intelligent shopping platform powered by collaborative AI agents that evaluate specifications, extract real user sentiment, and uncover value.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Multi-Agent AI Engine v1.0</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              Shop
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/shop?cat=laptops" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Laptops for Coding
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=smartphones" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Camera Smartphones
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=headphones" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  ANC Headphones
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=smartwatches" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Smartwatches under ₹5,000
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Product Comparison Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              AI Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/assistant" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Autonomous Concierge
                </Link>
              </li>
              <li>Intent Classifier</li>
              <li>Deep Spec Matrix Agent</li>
              <li>Sentiment Telemetry</li>
              <li>Price & Value Analyzer</li>
            </ul>
          </div>

          {/* Support & System */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              Company & Help
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>About ShopMind AI</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>
                <Link href="/api/health" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  System Health
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Built with precision & intelligence</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
