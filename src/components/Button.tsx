'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import '../app/globals.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
  className = '',
  disabled,
  ...props
}, ref) => {

  const classes = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;

  return (
    <button
      ref={ref}
      {...props}
      disabled={isLoading || disabled}
      className={classes}
    >

      {isLoading ? (
        <div className="btn-loading">

          <svg className="btn-spinner" viewBox="0 0 24 24">
            <circle
              className="spinner-bg"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="3"
              fill="none"
            />

            <path
              className="spinner-fg"
              d="M4 12a8 8 0 018-8"
            />
          </svg>

          <span>...</span>

        </div>
      ) : (
        <>
          {leftIcon && <span className="btn-icon">{leftIcon}</span>}

          <span>{children}</span>

          {rightIcon && <span className="btn-icon">{rightIcon}</span>}
        </>
      )}

    </button>
  );
});

Button.displayName = 'Button';