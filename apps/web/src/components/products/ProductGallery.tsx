"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  matchScore?: number;
}

export function ProductGallery({ images, name, matchScore }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const displayImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"];

  return (
    <div className="space-y-4">
      {/* Main Image Frame */}
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md">
        <Image
          src={displayImages[selectedIndex]}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />

        {matchScore && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>{matchScore}% AI Match Score</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? "border-indigo-600 ring-2 ring-indigo-500/20 scale-95"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${name} thumb ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
