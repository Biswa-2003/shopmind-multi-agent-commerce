"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Lock, Mail, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api, getErrorMessage } from "@/lib/api";
import { completeLogin } from "@/lib/session";
import { useLocationSearch } from "@/hooks/useHydrated";

interface AuthFormProps {
  mode: "login" | "register";
}

/** Only allow same-site relative redirects, e.g. "/cart" (never "//evil.com"). */
function getRedirectTarget(): string {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const locationSearch = useLocationSearch();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister && password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = isRegister
        ? await api.auth.register(name, email, password)
        : await api.auth.login(email, password);
      await completeLogin(session);
      router.push(getRedirectTarget());
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  // Carry ?next= across when switching between login and register
  const switchHref = `${isRegister ? "/login" : "/register"}${locationSearch}`;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 mx-auto">
            <Brain className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-zinc-500">
            {isRegister
              ? "Save your cart, wishlist and orders across devices."
              : "Log in to see your cart, wishlist and orders."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {isRegister && (
            <Input
              id="auth-name"
              label="Full name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<UserIcon className="w-4 h-4" />}
            />
          )}
          <Input
            id="auth-email"
            type="email"
            label="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
          <Input
            id="auth-password"
            type="password"
            label="Password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
            minLength={isRegister ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />

          {error && (
            <p role="alert" className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
            {isRegister ? "Create account" : "Log in"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          {isRegister ? "Already have an account?" : "New to ShopMind?"}{" "}
          <Link href={switchHref} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            {isRegister ? "Log in" : "Create one"}
          </Link>
        </p>
      </div>
    </div>
  );
}
