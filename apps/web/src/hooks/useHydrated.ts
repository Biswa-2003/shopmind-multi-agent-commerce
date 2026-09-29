"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False during server render and hydration, true once running in the browser. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

/** The current URL's query string (e.g. "?next=/cart"); empty on the server. */
export function useLocationSearch(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.location.search,
    () => ""
  );
}
