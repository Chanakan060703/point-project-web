import Link from 'next/link';
import { Button } from '@/components/Button';

export default function UnauthorizedPage() {
    return (
        <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-950 dark:via-indigo-950/20 dark:to-purple-950/20 overflow-hidden flex items-center justify-center p-4">
            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
            </div>

            <div className="relative text-center space-y-8 animate-[fadeInUp_0.7s_ease-out]">
                <h1 className="text-9xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">403</h1>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black dark:text-white">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md font-medium">
                        You do not have permission to access this page. Please contact your administrator if you believe this is an error.
                    </p>
                </div>
                <Link href="/">
                    <Button size="lg" className="shadow-lg">Return Home</Button>
                </Link>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}
