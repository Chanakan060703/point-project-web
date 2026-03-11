'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { register as registerApi } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
            setUser(response.user);
            setToken(response.token);
            toast.success('Account created successfully!');
            router.push('/');
            router.refresh();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Join us to start managing your points
                    </p>
                </div>

                <Card>
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

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}