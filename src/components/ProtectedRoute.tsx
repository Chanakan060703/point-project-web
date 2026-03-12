"use client";
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
    const { user, hasHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (hasHydrated && !user) {
            router.push('/auth/login');
        }

        if (hasHydrated && user && role && user.role !== role) {
            router.push('/unauthorized');
        }
    }, [user, hasHydrated, router, role]);

    if (!hasHydrated || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500 animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
        </div>
    );

    return <>{children}</>;
}
