'use client';

import React, { SelectHTMLAttributes, forwardRef } from 'react';
import '../app/globals.css';


interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {

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
            ref={ref}
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
);

Select.displayName = 'Select';