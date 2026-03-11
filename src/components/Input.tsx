import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
        <input
          {...props}
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none
            ${error
              ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20'
              : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20'
            }
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          `}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
