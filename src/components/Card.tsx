import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 ${className}`}>
      {children}
    </div>
  );
};
