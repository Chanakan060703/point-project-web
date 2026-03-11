// components/Button.tsx
'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2.5 font-semibold rounded-2xl transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden group",
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 
          text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 
          hover:-translate-y-0.5 border border-white/10
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 
          before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
        `,
        secondary: `
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
          text-gray-900 dark:text-white border border-gray-200/60 dark:border-gray-700/60
          hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600
          hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/30 hover:-translate-y-0.5
        `,
        outline: `
          bg-transparent border-2 border-indigo-300/60 dark:border-indigo-600/60
          text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 dark:hover:border-indigo-400
          hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 hover:-translate-y-0.5
          hover:shadow-lg hover:shadow-indigo-200/30 dark:hover:shadow-indigo-900/20
        `,
        ghost: `
          bg-transparent text-gray-600 dark:text-gray-300 
          hover:bg-gray-100/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white
        `,
        danger: `
          bg-gradient-to-r from-red-500 to-rose-500 text-white
          shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 
          hover:-translate-y-0.5 border border-white/10
        `,
      },
      size: {
        sm: "px-4 py-2 text-sm h-10",
        md: "px-6 py-3 text-base h-12",
        lg: "px-8 py-4 text-lg h-14",
        xl: "px-10 py-5 text-xl h-16",
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      disabled={isLoading || disabled}
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && 'w-full',
        className
      )}
    >
      {/* Shine Effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>กำลังโหลด...</span>
        </div>
      ) : (
        <>
          {leftIcon && <span className="transition-transform group-hover:scale-110">{leftIcon}</span>}
          <span className="relative z-10">{children}</span>
          {rightIcon && <span className="transition-transform group-hover:scale-110">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';