"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAssistant } from "@/hooks/useAssistant";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Brain, SquarePen, Laptop, Smartphone, Headphones, Scale, Watch, BatteryCharging } from "lucide-react";
import { BRAND_NAME, SUGGESTED_PROMPTS } from "@/lib/constants";

const PROMPT_ICONS = [Laptop, Smartphone, Headphones, Scale, Watch, BatteryCharging];

export function AssistantPanel() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const { messages, isLoading, sendMessage, clearChat } = useAssistant();
  const scrollRef = useRef<HTMLDivElement>(null);
  const promptHandled = useRef(false);
  const isEmpty = messages.length <= 1;
  const latestAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  useEffect(() => {
    if (initialPrompt && !promptHandled.current) {
      promptHandled.current = true;
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, sendMessage]);

  // Scroll inside the chat only (never the page). For a new reply, show its beginning so the
  // answer text stays visible even when product cards make it taller than the screen.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const last = messages[messages.length - 1];
    if (!isLoading && last?.role === "assistant" && messages.length > 1) {
      const el = container.querySelector<HTMLElement>(`[data-message-id="${last.id}"]`);
      if (el) {
        container.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
        return;
      }
    }
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/60 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0">
            <Brain className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white truncate">{BRAND_NAME} Assistant</h1>
            <p className="text-xs text-zinc-500 truncate">Answers from our live catalog · prices in ₹</p>
          </div>
        </div>

        {!isEmpty && (
          <button
            onClick={clearChat}
            id="assistant-clear-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Start a new conversation"
          >
            <SquarePen className="w-4 h-4" />
            <span className="hidden sm:inline">New chat</span>
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-3 sm:px-6 py-5 space-y-5" aria-live="polite">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isLatest={!isEmpty && msg.id === latestAssistantId && !isLoading}
            onActionClick={(prompt) => sendMessage(prompt)}
          />
        ))}

        {isEmpty && (
          <div className="pl-0 sm:pl-10">
            <p className="text-xs font-semibold text-zinc-500 mb-2">Try asking</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => {
                const Icon = PROMPT_ICONS[idx % PROMPT_ICONS.length];
                return (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="flex items-center gap-2.5 text-left text-sm px-3.5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{prompt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isLoading && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="px-3 sm:px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
        <p className="mt-1.5 text-[11px] text-zinc-400 text-center">
          AI answers can be wrong. Check prices and specs on the product page before buying.
        </p>
      </div>
    </div>
  );
}

export default AssistantPanel;
