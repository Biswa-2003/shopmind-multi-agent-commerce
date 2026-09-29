"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Bot,
  Brain,
  Star,
  CheckCircle2,
} from "lucide-react";
import { BRAND_TAGLINE, SUGGESTED_PROMPTS } from "@/lib/constants";
import { formatINR } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background Animated Gradient Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/15 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Autonomous AI-Powered E-commerce</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
              Shopping, powered by{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                intelligence.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover products, compare options and make smarter buying decisions with your personal AI shopping assistant.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                id="hero-cta-assistant"
                href="/assistant"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all hover:scale-[1.02]"
              >
                <Bot className="w-5 h-5" />
                <span>Ask AI Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                id="hero-cta-shop"
                href="/shop"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-sm sm:text-base transition-colors"
              >
                Explore Products
              </Link>
            </div>

            {/* Quick Suggested Queries */}
            <div className="pt-4 max-w-xl mx-auto lg:mx-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Try asking questions like:
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, i) => (
                  <Link
                    key={i}
                    href={`/assistant?prompt=${encodeURIComponent(prompt)}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-2xs"
                  >
                    &ldquo;{prompt}&rdquo;
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Column: Premium Interactive AI Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-3xl blur-2xl -z-10" />

            <div className="w-full max-w-md space-y-4">
              {/* User Mock Message Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="ml-auto max-w-xs bg-indigo-600 text-white p-4 rounded-3xl rounded-br-none shadow-md text-xs sm:text-sm font-medium"
              >
                &ldquo;Find a laptop under ₹60,000 for coding.&rdquo;
              </motion.div>

              {/* AI Assistant Reasoning Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mr-auto max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-3xl rounded-bl-none shadow-lg text-xs leading-relaxed space-y-2"
              >
                <div className="flex items-center gap-2 text-indigo-600 font-bold">
                  <Brain className="w-4 h-4" />
                  <span>ShopMind AI</span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300">
                  I analyzed 14 coding benchmarks. The <strong className="font-semibold">Acer Swift Go 14</strong> matches with a 2.8K OLED screen and 16GB RAM for compilation.
                </p>
              </motion.div>

              {/* Floating Recommended Product Preview Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-4 rounded-3xl border border-indigo-100 dark:border-indigo-950 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-2xl space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
                      alt="Acer Swift Go 14"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>98% Coding Match Score</span>
                    </div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                      Acer Swift Go 14 OLED
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                        {formatINR(57990)}
                      </span>
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                        <span>4.7</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/products/lap-1"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
                >
                  <span>Inspect Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
