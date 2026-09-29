import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-lg">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>SmartShop AI</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Autonomous multi-agent shopping intelligence helping modern consumers make verified, data-backed purchase choices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Spec Comparison
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              AI Multi-Agent Core
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>Intent Classifier</li>
              <li>Deep Spec Matrix Agent</li>
              <li>Sentiment Telemetry</li>
              <li>Cross-Store Arbitrage Engine</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              System
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/api/health" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  API Health Status
                </Link>
              </li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} SmartShop AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using Next.js App Router & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
