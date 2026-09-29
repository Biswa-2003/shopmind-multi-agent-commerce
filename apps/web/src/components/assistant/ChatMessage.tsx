"use client";

import React from "react";
import Link from "next/link";
import { Brain, CheckCircle2, User as UserIcon, WifiOff } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/types/assistant";
import { ProductRecommendation } from "./ProductRecommendation";
import { ProductComparison } from "./ProductComparison";
import { MessageText } from "./MessageText";

interface ChatMessageProps {
  message: ChatMessageType;
  /** Follow-up suggestions only make sense on the newest reply. */
  isLatest?: boolean;
  onActionClick?: (prompt: string) => void;
}

export function ChatMessage({ message, isLatest = false, onActionClick }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const isComparison = Boolean(message.comparisonProducts && message.comparisonProducts.length >= 2);
  // A comparison table already shows these products; don't repeat them as cards
  const cards = isComparison ? [] : message.recommendations ?? [];

  if (!isAssistant) {
    return (
      <div className="flex justify-end gap-2.5" data-message-id={message.id}>
        <div className="max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl rounded-br-md bg-indigo-600 text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
          <UserIcon className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5" data-message-id={message.id}>
      {/* Avatar hidden on phones to give cards and tables the full width */}
      <div className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 items-center justify-center text-white shrink-0">
        <Brain className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="max-w-2xl px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 shadow-sm">
          <MessageText text={message.content} />
          {message.offline && (
            <p className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-amber-600 dark:text-amber-400">
              <WifiOff className="w-3 h-3" />
              Offline answer: the ShopMind server couldn&apos;t be reached, so this is a built-in suggestion.
            </p>
          )}
        </div>

        {message.addedToCart && message.addedToCart.length > 0 && (
          <div className="max-w-2xl flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Added to your cart:{" "}
              {message.addedToCart.map((a) => `${a.quantity > 1 ? `${a.quantity} × ` : ""}${a.name}`).join(", ")}
            </span>
            <Link href="/cart" className="underline underline-offset-2 hover:text-emerald-900 dark:hover:text-emerald-100">
              View cart
            </Link>
          </div>
        )}

        {isComparison && <ProductComparison products={message.comparisonProducts!} />}

        {cards.length > 0 && (
          <div className={`grid gap-2.5 ${cards.length > 1 ? "lg:grid-cols-2" : "max-w-xl"}`}>
            {cards.map((rec) => (
              <ProductRecommendation key={rec.product.id} rec={rec} />
            ))}
          </div>
        )}

        {isLatest && message.actionPrompts && message.actionPrompts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.actionPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onActionClick?.(prompt)}
                className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
