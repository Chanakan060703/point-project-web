'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { getCurrentPoints } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';
import '../app/globals.css';

export const PointDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!user?.userId) return;

      try {
        const pointTotal = await getCurrentPoints(user.userId);
        setPoints(pointTotal);
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

  if (loading) {
    return (
      <Card className="points-loading">
        <div className="points-loading-title" />
        <div className="points-loading-number" />
      </Card>
    );
  }

  const pointsDisplay = points ?? 0;
  const progress = pointsDisplay % 100;

  return (
    <Card className="points-card">

      <div className="points-container">

        <span className="points-labels">
          คะแนนสะสมของคุณ
        </span>

        <div className="points-value">
          <span className="points-number">
            {pointsDisplay.toLocaleString()}
          </span>
          <span className="points-units">
            แต้ม
          </span>
        </div>

        <div className="points-info">
          100 บาท = 10 แต้ม • ใช้แทนเงินสดได้
        </div>

        <div className="points-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

      </div>

    </Card>
  );
};