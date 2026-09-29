"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ComparisonTable from "@/components/compare/ComparisonTable";
import { useCatalog } from "@/hooks/useCatalog";
import { Scale } from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const products = useCatalog();
  const initialProductId = searchParams.get("p") || undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
          <Scale className="w-3.5 h-3.5" />
          <span>Spec-by-Spec Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Product Comparison Matrix
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Compare specifications, ratings, price differences, and AI-synthesized pros and cons.
        </p>
      </div>

      <ComparisonTable products={products} initialSelectedId={initialProductId} />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-zinc-400 text-sm">
          Loading comparison matrix...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
