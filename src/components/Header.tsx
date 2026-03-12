'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { logout as apiLogout } from '@/lib/auth';
import { usePointStore } from '@/store/usePointStore';
import '../app/globals.css';

export const Header: React.FC = () => {
  const { user, logout: storeLogout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const points = usePointStore((state) => state.points);
  const fetchPoints = usePointStore((state) => state.fetchPoints);
  const resetPoints = usePointStore((state) => state.reset);

  useEffect(() => {
    if (!user?.userId) {
      resetPoints();
      return;
    }

    void fetchPoints(user.userId);
    const interval = setInterval(() => {
      void fetchPoints(user.userId, true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPoints, pathname, resetPoints, user?.userId]);

  const handleLogout = () => {
    apiLogout();
    storeLogout();
    resetPoints();
    router.push('/auth/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'ออกบิล', href: '/bill' },
    { name: 'ประวัติ', href: '/transaction' },
  ];

  return (
    <header className="header">
      <div className="header-container">

        <Link href="/" className="logo">
          หม่าล่าเชิงดอย
        </Link>

        <nav className="nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          {user && (
            <>
              <div className="points-box">
                <span className="points-label">แต้มสะสม</span>
                <span className="points-value">
                  {points !== null ? points.toLocaleString() : '...'} <span className="points-unit">แต้ม</span>
                </span>
              </div>

              <button
                onClick={() => handleLogout()}
                className="logout-btn"
              >
                ออกจากระบบ
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};