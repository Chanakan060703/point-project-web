'use client';

import React, { InputHTMLAttributes, Ref, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import '../app/globals.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  error,
  hint,
  icon,
  showPasswordToggle,
  type = 'text',
  className = '',
  inputRef,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle ? showPassword ? 'text' : 'password' : type;
  const inputClass = `input-field
      ${icon ? 'input-with-icon' : ''}
      ${showPasswordToggle ? 'input-with-toggle' : ''}
      ${error ? 'input-error' : ''}
      ${className}
    `;

  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>

      <div className="input-container">
        {icon && <div className="input-icon">{icon}</div>}

        <input {...props}
          ref={inputRef}
          type={inputType}
          className={inputClass}
        />

        {showPasswordToggle && (
          <button
            type="button"
            className="input-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <div className="input-error-message">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {hint && !error && <p className="input-hint">{hint}</p>}
    </div>
  );
}
