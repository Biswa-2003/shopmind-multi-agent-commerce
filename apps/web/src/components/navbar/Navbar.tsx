"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShoppingCart, Scale, Bot, Box, Search } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const pathname = usePathname();
  const { summary } = useCart();

  const navLinks = [
    { href: "/products", label: "Catalog", icon: Box },
    { href: "/assistant", label: "AI Assistant", icon: Bot, highlight: true },
    { href: "/compare", label: "Compare", icon: Scale },
    { href: "/orders", label: "Orders" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          id="nav-brand-logo"
          href="/"
          className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xl tracking-tight group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            SmartShop<span className="text-indigo-500">.ai</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60"
                } ${item.highlight ? "text-indigo-600 dark:text-indigo-400" : ""}`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 ml-0.5">
                    Live
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            id="nav-quick-search-btn"
            href="/products"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            title="Search products"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link
            id="nav-cart-btn"
            href="/cart"
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 transition-all font-medium text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {summary.totalItems > 0 && (
              <span
                id="nav-cart-count-badge"
                className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center -mr-1"
              >
                {summary.totalItems}
              </span>
            )}
          </Link>

          <Link
            id="nav-cta-assistant-btn"
            href="/assistant"
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-sm shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
          >
            <Bot className="w-4 h-4" />
            Ask Assistant
          </Link>
        </div>
      </div>
    </header>
  );
}
