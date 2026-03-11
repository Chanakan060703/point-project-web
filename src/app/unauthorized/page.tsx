import Link from 'next/link';
import { Button } from '@/components/Button';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
            <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold text-red-600">403</h1>
                <h2 className="text-2xl font-semibold">Access Denied</h2>
                <p className="text-gray-500 max-w-md">
                    You do not have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>
                <Link href="/">
                    <Button>Return Home</Button>
                </Link>
            </div>
        </div>
    );
}
