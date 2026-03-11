import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
        <div className="relative">
          <select
            {...props}
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none appearance-none
              ${error 
                ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20' 
                : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20'
              }
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            `}
          >
            <option value="" disabled>Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
