import React from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/data/testimonials";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Real Stories
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-1">
          Loved by Smart Shoppers
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          Here is what tech enthusiasts, developers, and photographers say about their purchases with ShopMind AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-xl transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 mr-0.5" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                &ldquo;{t.comment}&rdquo;
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                <Image src={t.avatar} alt={t.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                  {t.name}
                </h4>
                <p className="text-[11px] text-zinc-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
