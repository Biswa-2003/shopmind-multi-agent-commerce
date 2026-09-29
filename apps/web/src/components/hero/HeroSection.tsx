"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Bot, ShieldCheck, Zap, Layers } from "lucide-react";

export default function HeroSection() {
  const sampleQueries = [
    "Noise-cancelling headphones under $250",
    "Lightweight coding laptop with 32GB RAM",
    "Smartwatch with ECG and multi-day battery",
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Next-Generation Multi-Agent AI Shopping</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Shop Smarter with Real-Time{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            AI Autonomous Agents
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Skip hours of scrolling reviews. Our collaborative AI agents inspect specifications,
          synthesize customer sentiment, verify price fairness, and tailor recommendations to you.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            id="hero-start-assistant-btn"
            href="/assistant"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02]"
          >
            <Bot className="w-5 h-5" />
            Talk to AI Shopping Assistant
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            id="hero-explore-catalog-btn"
            href="/products"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-base transition-colors"
          >
            Explore Catalog
          </Link>
        </div>

        {/* Quick Prompt Pills */}
        <div className="mt-10 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
            Or try asking:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {sampleQueries.map((query, idx) => (
              <Link
                key={idx}
                href={`/assistant?prompt=${encodeURIComponent(query)}`}
                className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
              >
                &ldquo;{query}&rdquo;
              </Link>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">
              Autonomous Search Agent
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Extracts nuances from natural language prompts to index specs and real-time inventory.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">
              Deep Comparative Matrix
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Side-by-side spec parsing highlighting pros, cons, trade-offs, and value scores.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:border-pink-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">
              Review Sentiment Engine
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Filters out fake reviews and summarizes verified buyers&apos; long-term durability impressions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
