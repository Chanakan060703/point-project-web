'use client';

import React from 'react';
import '../app/globals.css';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
}) => {
  const cardClass = `card ${hoverEffect ? 'card-hover' : ''} ${className}`;

  return (
    <div className={cardClass}>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};