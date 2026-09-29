import React from "react";
import { Brain } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5" role="status" aria-label="ShopMind AI is typing">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0">
        <Brain className="w-4 h-4 animate-pulse" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.15s]" />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.3s]" />
        <span className="text-xs text-zinc-500 ml-1.5">Finding the best matches…</span>
      </div>
    </div>
  );
}
