'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { logout as apiLogout } from '@/lib/auth';
import { usePointStore } from '@/store/usePointStore';

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
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'ออกบิล', href: '/bill' },
    { name: 'ประวัติ', href: '/transaction' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100/50 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-black/70">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 font-black text-white shadow-lg shadow-indigo-500/20">
            M
          </div>
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-2xl font-black text-transparent">
            หม่าล่าเชียงดอย
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-bold tracking-tight transition-all hover:scale-105 ${
                pathname === link.href
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="hidden flex-col items-end sm:flex border-r border-gray-100 dark:border-gray-800 pr-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Balance</span>
                <span className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {points !== null ? points.toLocaleString() : '...'} <span className="text-[10px] font-bold text-gray-400">PTS</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-red-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400"
            >
              Sign In
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
