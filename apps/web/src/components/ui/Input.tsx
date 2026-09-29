"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`w-full py-2.5 px-4 rounded-xl border bg-white dark:bg-zinc-900 text-sm transition-all focus:outline-none focus:ring-2 ${
              icon ? "pl-10" : ""
            } ${
              error
                ? "border-rose-500 focus:ring-rose-500/30 text-rose-900 dark:text-rose-200"
                : "border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500/30 focus:border-indigo-500"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
