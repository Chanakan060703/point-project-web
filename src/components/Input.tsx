// components/Input.tsx
'use client';

import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, showPasswordToggle, type = 'text', className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle
      ? (showPassword ? 'text' : 'password')
      : type;

    return (
      <div className="w-full space-y-2.5">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">
          {label}
        </label>

        <div className={cn(
          "relative group transition-all duration-300",
          isFocused && "scale-[1.02]"
        )}>
          {/* Icon */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              {icon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            type={inputType}
            onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
            className={cn(
              "w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 outline-none bg - white / 80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 disabled:opacity-60 disabled:cursor-not-allowed",
              icon && "pl-11",
              showPasswordToggle && "pr-11",
              error
                ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30"
                : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-600",
              className
            )}
          />

          {/* Password Toggle */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          {/* Focus Ring Glow */}
          <div className={cn(
            "absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none",
            isFocused && !error && "ring-4 ring-indigo-400/20 dark:ring-indigo-500/20",
            isFocused && error && "ring-4 ring-red-400/20 dark:ring-red-500/20"
          )} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400 font-medium animate-[shake_0.3s_ease-in-out]">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Hint Text */}
        {hint && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
