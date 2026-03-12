'use client';

import React, { Ref, SelectHTMLAttributes } from 'react';
import '../app/globals.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  selectRef?: Ref<HTMLSelectElement>;
}

export function Select({
  label,
  options,
  error,
  className = '',
  selectRef,
  ...props
}: SelectProps) {
  const selectClass = `
      select-field
      ${error ? 'select-error' : ''}
      ${className}
    `;

  return (
    <div className="select-wrapper">
      <label className="select-label">{label}</label>
      <div className="select-container">
        <select
          {...props}
          ref={selectRef}
          className={selectClass}
          defaultValue=""
        >
          <option value="" disabled>
            Select {label}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-arrow">⌄</span>
      </div>
      {error && <p className="select-error-text">{error}</p>}
    </div>
  );
}
