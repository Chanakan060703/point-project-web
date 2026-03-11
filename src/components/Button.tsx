import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  ...props
}) => {
  const baseStyles = "relative px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
    outline: "border-2 border-gray-200 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-700 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};
