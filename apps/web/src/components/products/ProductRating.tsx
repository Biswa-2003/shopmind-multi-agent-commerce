import React from "react";
import { Star } from "lucide-react";

interface ProductRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}

export function ProductRating({ rating, reviewCount, size = "sm" }: ProductRatingProps) {
  const iconSizes = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSizes = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={`flex items-center gap-1.5 ${textSizes}`}>
      <div className="flex items-center text-amber-500 font-bold">
        <Star className={`${iconSizes} fill-amber-500 mr-1`} />
        <span>{rating.toFixed(1)}</span>
      </div>
      {reviewCount !== undefined && (
        <span className="text-zinc-400 text-xs">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
