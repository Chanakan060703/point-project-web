'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { login } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/FormInput';

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const router = useRouter();

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
            await login(data.username, data.password);
            router.push('/Bill');
            router.refresh();
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Please enter your details to sign in
                    </p>
                </div>

                <Card>
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

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
