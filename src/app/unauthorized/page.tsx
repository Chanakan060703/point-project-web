'use client';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function UnauthorizedPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
            <div className="text-center space-y-8">
                <h1 className="text-9xl font-extrabold text-red-600">403</h1>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md font-medium">
                        You do not have permission to access this page. Please contact your administrator if you believe this is an error.
                    </p>
                </div>
                <Link href="/">
                    <Button size="lg">Return Home</Button>
                </Link>
            </div>
        </main>
    );
}
