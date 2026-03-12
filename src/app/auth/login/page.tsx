'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { login, getProfile } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { FormInput } from '@/components/FormInput';
import { useAuthStore } from '@/store/useAuthStore';
import '../../globals.css';

const loginSchema = z.object({
    username: z.string().min(3, 'กรุณากรอกชื่อผู้ใช้'),
    password: z.string().min(6, 'กรุณากรอกรหัสผ่าน'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const router = useRouter();
    const { setUser, setToken, user } = useAuthStore();
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

                router.replace('/');
            } else {
                setApiError('ยืนยันตัวตนไม่สำเร็จ: ไม่ได้รับโทเคน');
            }
        } catch (error) {
            const message =
                error instanceof AxiosError
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง';

            setApiError(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            router.replace('/');
        }
    })

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

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="btn-loading">
                                    <svg className="btn-spinner" viewBox="0 0 24 24">
                                        <circle
                                            className="spinner-bg"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            strokeWidth="3"
                                            fill="none"
                                        />
                                        <path
                                            className="spinner-fg"
                                            d="M4 12a8 8 0 018-8"
                                        />
                                    </svg>

                                    <span>...</span>
                                </div>
                            ) : (
                                <span>เข้าสู่ระบบ</span>
                            )}
                        </button>
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
