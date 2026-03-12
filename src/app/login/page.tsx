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
import '../globals.css';

const loginSchema = z.object({
    username: z.string().min(3, 'กรุณากรอก ชื่อผู้ใช้'),
    password: z.string().min(6, 'กรุณากรอก รหัสผ่าน'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();

    const { control, handleSubmit } = useForm<LoginFormValues>({
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
        <main className="login-page">
            <div className="login-container">

                <div className="login-header">
                    <h1>ยินดีต้อนรับ</h1>
                    <p>กรุณาเข้าสู่ระบบ</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">

                        {apiError && (
                            <div className="login-error">
                                {apiError}
                            </div>
                        )}

                        <FormInput
                            name="username"
                            control={control}
                            label="ชื่อผู้ใช้"
                            placeholder="ชื่อผู้ใช้"
                        />

                        <FormInput
                            name="password"
                            control={control}
                            label="รหัสผ่าน"
                            type="password"
                            placeholder="••••••••"
                        />

                        <div className="login-options">
                            <label className="remember">
                                <input type="checkbox" />
                                <span>จดจำฉัน</span>
                            </label>

                            <a href="#" className="forgot">
                                ลืมรหัสผ่าน?
                            </a>
                        </div>

                        <Button type="submit" className="login-button" isLoading={isLoading} size="lg">
                            เข้าสู่ระบบ
                        </Button>

                    </form>
                </Card>

                <p className="login-register">
                    {`Don't have an account? `}
                    <Link href="/register">
                        สร้างบัญชี
                    </Link>
                </p>

            </div>
        </main>
    );
}