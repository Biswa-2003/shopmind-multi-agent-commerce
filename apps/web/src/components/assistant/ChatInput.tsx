"use client";

import React, { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const MAX_LENGTH = 1000; // matches the server's limit

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Ready for the next question as soon as a reply arrives
  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          id="assistant-input-field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          placeholder="Ask about products, prices, specs… e.g. “laptop under ₹60,000 for coding”"
          aria-label="Message ShopMind AI"
          className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400"
        />
        {input.length > MAX_LENGTH - 200 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
            {input.length}/{MAX_LENGTH}
          </span>
        )}
      </div>

      <button
        id="assistant-submit-btn"
        type="submit"
        disabled={!input.trim() || isLoading}
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        <SendHorizontal className="w-5 h-5" />
      </button>
    </form>
  );
}
