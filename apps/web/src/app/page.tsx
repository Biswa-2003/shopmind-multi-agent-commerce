import React from "react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import { fetchCatalog } from "@/lib/catalog";
import ProductCard from "@/components/products/ProductCard";
import { Bot, Sparkles, ArrowRight, Brain } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

export default async function HomePage() {
  const catalog = await fetchCatalog();
  const previewProducts = catalog.filter(
    (p) => p.category === "Laptops" && p.price <= 60000
  ).slice(0, 3);

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Categories Section */}
      <CategorySection />

      {/* 3. Featured Products */}
      <FeaturedProducts />

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. AI Assistant Interactive Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold">
                <Brain className="w-3.5 h-3.5" />
                <span>Live AI Preview</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ask Complex Questions in Everyday Language
              </h2>
              <p className="text-indigo-200 text-xs sm:text-sm max-w-xl mx-auto">
                No need to manually filter through 50 specs. See how our AI matches products directly to what you actually need.
              </p>
            </div>

            {/* Mock Chat Stream Container */}
            <div className="space-y-4 max-w-2xl mx-auto bg-black/30 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-br-none text-xs sm:text-sm font-medium shadow-sm">
                  I need a laptop under ₹60,000 for coding.
                </div>
              </div>

              {/* AI Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 text-white shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-2">
                  <div className="bg-white/10 border border-white/10 text-zinc-100 px-4 py-3 rounded-2xl rounded-tl-none text-xs sm:text-sm leading-relaxed">
                    Here are laptops that match your budget and coding requirements:
                  </div>
                </div>
              </div>

              {/* Recommended Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {previewProducts.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-white flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 relative shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs truncate">{item.name}</div>
                      <div className="text-indigo-300 font-extrabold text-xs mt-0.5">
                        ₹{item.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <Link
                      href={`/products/${item.id}`}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-[10px] font-bold text-white shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Try the AI Shopping Assistant</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16 px-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-md space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Your smarter shopping journey starts here.
          </h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">
            Experience shopping with artificial intelligence built to save you time and maximize value.
          </p>
          <div className="pt-2">
            <Link
              id="final-cta-btn"
              href="/assistant"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
            >
              <Bot className="w-5 h-5" />
              <span>Talk to {BRAND_NAME}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
