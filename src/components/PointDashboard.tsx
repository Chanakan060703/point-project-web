// components/PointDashboard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { getCurrentPoints } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Coins, TrendingUp, Gift, Sparkles } from 'lucide-react';

export const PointDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevPoints, setPrevPoints] = useState<number>(0);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!user?.userId) return;
      try {
        const pointTotal = await getCurrentPoints(user.userId);
        setPoints((currentPoints) => {
          if (currentPoints !== null && pointTotal > currentPoints) {
            setPrevPoints(currentPoints);
          }

          return pointTotal;
        });
      } catch (error) {
        console.error('Failed to fetch points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
    const interval = setInterval(fetchPoints, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const pointsDisplay = points ?? 0;
  const gainedPoints = pointsDisplay - prevPoints;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
          <Coins className="w-8 h-8 text-gray-300 dark:text-gray-600" />
        </div>
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 border-none text-white shadow-2xl shadow-indigo-500/30">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <Sparkles
          key={i}
          className="absolute w-4 h-4 text-white/30 animate-[float_3s_ease-in-out_infinite]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
            <Coins className="w-6 h-6" />
          </div>
          <span className="text-indigo-100 text-sm font-semibold uppercase tracking-wider">
            คะแนนสะสมของคุณ
          </span>
        </div>

        {/* Points Display */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-6xl md:text-7xl font-black tracking-tight">
            {pointsDisplay.toLocaleString()}
          </span>
          <span className="text-xl text-indigo-100 font-medium">Pts</span>
        </div>

        {/* Points Change Indicator */}
        {gainedPoints > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4 animate-[fadeInUp_0.3s_ease-out]">
            <TrendingUp className="w-4 h-4" />
            +{gainedPoints.toLocaleString()} แต้มใหม่!
          </div>
        )}

        {/* Exchange Rate */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-2xl text-sm font-medium">
          <Gift className="w-4 h-4" />
          <span>100 บาท = 10 แต้ม • ใช้แทนเงินสดได้</span>
        </div>

        {/* Progress to Next Reward */}
        <div className="w-full max-w-xs mt-6">
          <div className="flex justify-between text-xs text-indigo-100 mb-2">
            <span>ระดับถัดไป</span>
            <span>{Math.min(100, Math.round((pointsDisplay % 100) / 100 * 100))}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(pointsDisplay % 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
