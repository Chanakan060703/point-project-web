'use client';

import { useEffect, useState } from "react";
import { getSession, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getSession();
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black items-center justify-center p-6">
      <Card className="w-full max-w-lg text-center space-y-8 py-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Mala Point System
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isAuthenticated
              ? "Welcome back! You are securely logged in."
              : "Manage your points with ease and security."
            }
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          {isAuthenticated ? (
            <>
              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-2xl text-green-700 dark:text-green-400 font-medium">
                Authenticated ✓
              </div>
              <Button onClick={handleLogout} variant="outline">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => router.push('/login')}>
                Sign In
              </Button>
              <Button onClick={() => router.push('/register')} variant="outline">
                Create Account
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
