// components/Card.tsx
'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  gradient?: boolean;
  borderGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  gradient = false,
  borderGlow = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 transition-all duration-500 ease-out",
        hoverEffect && "hover:-translate-y-1",
        gradient
          ? "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
        borderGlow && isHovered && "shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]",
        "border border-gray-200/60 dark:border-gray-700/60",
        "shadow-xl shadow-gray-200/40 dark:shadow-gray-900/40",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Border Glow */}
      {borderGlow && (
        <div className={cn(
          "absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none",
          "bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-purple-500/0",
          isHovered ? "opacity-100" : "opacity-0"
        )} />
      )}

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-60" />
      <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-60" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
