'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { register as registerApi, getProfile } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
    age: z.string().min(1, 'Age is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Age must be a positive number',
    }),
    gender: z.string().min(1, 'Please select a gender'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();

    const {
        control,
        handleSubmit,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            username: '',
            password: '',
            confirmPassword: '',
            age: '',
            gender: '',
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);

        try {
            const response = await registerApi(
                data.name,
                data.username,
                data.password,
                Number(data.age),
                data.gender
            );
            const token = response.access_token || response.token;
            if (token) {
                setToken(token);
                const profile = await getProfile();
                setUser({
                    userId: profile.userId,
                    username: profile.username,
                    role: profile.role
                });
                toast.success('Account created successfully!');
                router.push('/');
                router.refresh();
            } else {
                toast.error('Registration successful, but login failed: No token received.');
            }
        } catch (error) {
            const errorMessage =
                error instanceof AxiosError
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : 'Registration failed. Please try again.';
            toast.error(errorMessage);
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
                        Create Account
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Join us to start managing your points
                    </p>
                </div>

                <Card gradient className="borderGlow">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormInput
                            name="name"
                            control={control}
                            label="Full Name"
                            placeholder="John Doe"
                        />

                        <FormInput
                            name="username"
                            control={control}
                            label="Username"
                            placeholder="username"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                name="password"
                                control={control}
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                            />

                            <FormInput
                                name="confirmPassword"
                                control={control}
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                name="age"
                                control={control}
                                label="Age"
                                type="number"
                                placeholder="Age"
                            />

                            <FormSelect
                                name="gender"
                                control={control}
                                label="Gender"
                                options={[
                                    { value: 'MALE', label: 'Male' },
                                    { value: 'FEMALE', label: 'Female' },
                                    { value: 'OTHER', label: 'Other' },
                                ]}
                            />
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a>
                        </div>

                        <Button type="submit" className="w-full shadow-lg" isLoading={isLoading} size="lg">
                            Create Account
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                        Sign in
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
