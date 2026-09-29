import React from "react";
import { MessageSquare, Brain, Scale, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Tell us what you need",
      description: "Type or ask in natural language, specifying your budget, preferred brands, or exact usage.",
      icon: MessageSquare,
    },
    {
      number: "02",
      title: "AI understands requirements",
      description: "Our Intent & Search agents parse specs, benchmarks, and verified reviews to shortlist contenders.",
      icon: Brain,
    },
    {
      number: "03",
      title: "Compare suitable products",
      description: "Evaluate side-by-side matrices highlighting pros, cons, tradeoffs, and battery endurance.",
      icon: Scale,
    },
    {
      number: "04",
      title: "Make confident decisions",
      description: "Add to cart with genuine manufacturer warranties and 7-day hassle-free replacements.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Seamless Experience
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-1 mb-4">
          How ShopMind AI Works
        </h2>
        <p className="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Skip hours of comparing tabs and endless reviews. Let autonomous AI agents do the heavy research for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs hover:shadow-lg hover:border-indigo-500/40 transition-all text-left space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-zinc-300 dark:text-zinc-700">
                  {step.number}
                </span>
              </div>

              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
