import React, { Suspense } from "react";
import AssistantPanel from "@/components/assistant/AssistantPanel";

export default function AssistantPage() {
  return (
    // Fill the screen below the navbar (and above the mobile bottom nav) so only the chat scrolls
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 h-[calc(100dvh-4rem-4rem)] md:h-[calc(100dvh-4rem)] min-h-[480px]">
      <Suspense
        fallback={
          <div className="h-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center">
            <div className="text-zinc-400 text-sm animate-pulse">Loading assistant…</div>
          </div>
        }
      >
        <AssistantPanel />
      </Suspense>
    </div>
  );
}
