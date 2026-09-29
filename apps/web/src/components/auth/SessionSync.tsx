"use client";

import { useEffect } from "react";
import { refreshSession } from "@/lib/session";

/** Syncs a stored login with the server once per page load. Renders nothing. */
export default function SessionSync() {
  useEffect(() => {
    refreshSession();
  }, []);

  return null;
}
