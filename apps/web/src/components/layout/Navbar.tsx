"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Brain,
  ShoppingCart,
  Heart,
  Scale,
  Sparkles,
  Menu,
  X,
  User,
  ShoppingBag,
  Search,
  Package,
  LogOut,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { BRAND_NAME } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { summary } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleLogout = () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    router.push("/");
  };
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/compare", label: "Compare", icon: Scale },
    { href: "/assistant", label: "AI Assistant", highlight: true, icon: Sparkles },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 dark:bg-zinc-950/85 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          id="nav-brand-logo"
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">
              {BRAND_NAME.split(" ")[0]}
              <span className="text-indigo-600 dark:text-indigo-400">
                .{BRAND_NAME.split(" ")[1]}
              </span>
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
              INTELLIGENT COMMERCE
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                } ${item.highlight ? "text-indigo-600 dark:text-indigo-400" : ""}`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                    Live
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar Input / Trigger */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search laptops, phones, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </form>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Link with Badge */}
          <Link
            id="nav-wishlist-btn"
            href="/wishlist"
            className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link with Badge */}
          <Link
            id="nav-cart-btn"
            href="/cart"
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all font-medium text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Cart</span>
            {summary.totalItems > 0 && (
              <span
                id="nav-cart-count"
                className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center -mr-1"
              >
                {summary.totalItems}
              </span>
            )}
          </Link>

          {/* Account Menu */}
          {isLoggedIn ? (
            <div className="relative hidden sm:block">
              <button
                id="nav-user-profile-btn"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                title="Account"
                aria-haspopup="menu"
                aria-expanded={accountMenuOpen}
              >
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="hidden lg:inline text-sm font-semibold max-w-[8rem] truncate">
                  {user?.name?.split(" ")[0]}
                </span>
              </button>
              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-2 text-sm"
                >
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <p className="font-semibold text-zinc-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/orders"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              id="nav-user-profile-btn"
              href="/login"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors hidden sm:flex items-center justify-center gap-1.5"
              title="Log in"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:inline text-sm font-semibold">Log in</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search */}
      {searchOpen && (
        <div className="lg:hidden p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
            />
          </form>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {item.icon && <item.icon className="w-4 h-4 text-indigo-500" />}
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
            <span>All Categories</span>
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Package className="w-4 h-4 text-indigo-500" />
                <span>My Orders</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out ({user?.name?.split(" ")[0]})</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <User className="w-4 h-4 text-indigo-500" />
              <span>Log in / Create account</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
