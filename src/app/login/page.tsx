'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { login, getProfile } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { FormInput } from '@/components/FormInput';
import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();

    const {
        control,
        handleSubmit,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setApiError('');

        try {
            const response = await login(data.username, data.password);
            const token = response.access_token || response.token;

            if (token) {
                setToken(token);
                const profile = await getProfile();
                setUser({
                    userId: profile.userId,
                    username: profile.username,
                    role: profile.role
                });

                router.push('/');
                router.refresh();
            } else {
                setApiError('Authentication failed: No token received.');
            }
        } catch (error) {
            const message =
                error instanceof AxiosError
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : 'Login failed. Please check your credentials.';

            setApiError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-950 dark:via-indigo-950/20 dark:to-purple-950/20 overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/5 to-purple-300/5 rounded-full blur-2xl" />
            </div>

            <div className="relative w-full max-w-md space-y-8 animate-[fadeInUp_0.7s_ease-out]">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Please enter your details to sign in
                    </p>
                </div>

                <Card gradient className="borderGlow">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {apiError && (
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
                                {apiError}
                            </div>
                        )}

                        <FormInput
                            name="username"
                            control={control}
                            label="Username"
                            placeholder="username"
                        />

                        <FormInput
                            name="password"
                            control={control}
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </a>
                        </div>

                        <Button type="submit" className="w-full shadow-lg" isLoading={isLoading} size="lg">
                            Sign In
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {`Don't have an account? `}
                    <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                        Create an account
                    </Link>
                </p>
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
