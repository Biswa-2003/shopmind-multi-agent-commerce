"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/lib/session";

export function useAuth() {
  const hydrated = useHydrated();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  return {
    user: hydrated ? user : null,
    isLoggedIn: hydrated && Boolean(token),
    isHydrated: hydrated,
    logout,
  };
}
