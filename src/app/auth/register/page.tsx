'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
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
import '../../globals.css';

const registerSchema = z.object({
    name: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล ไม่ต่ำกว่า 2 ตัวอักษร').max(50, 'กรุณากรอกชื่อ-นามสกุลไม่เกิน 50 ตัวอักษร'),
    username: z.string().min(3, 'กรุณากรอกชื่อผู้ใช้ ไม่ต่ำกว่า 3 ตัวอักษร').max(20, 'กรุณากรอกชื่อผู้ใช้ไม่เกิน 20 ตัวอักษร'),
    password: z.string().min(6, 'กรุณากรอกรหัสผ่าน ไม่ต่ำกว่า 6 ตัวอักษร').max(20, 'กรุณากรอกรหัสผ่านไม่เกิน 20 ตัวอักษร'),
    confirmPassword: z.string().min(6, 'กรุณากรอกยืนยันรหัสผ่าน ไม่ต่ำกว่า 6 ตัวอักษร').max(20, 'กรุณากรอกยืนยันรหัสผ่านไม่เกิน 20 ตัวอักษร'),
    age: z
        .string()
        .min(1, 'กรุณากรอกอายุ')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'กรุณากรอกเฉพาะตัวเลข',
        }),
    gender: z.string().min(1, 'กรุณาเลือกเพศ'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ถูกต้อง',
    path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();
    const [error, setError] = useState('');

    const { control, handleSubmit } = useForm<RegisterFormValues>({
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
                    role: profile.role,
                });

                toast.success('สร้างบัญชีสำเร็จ');
                router.push('/');
                router.refresh();
            } else {
                toast.error('สมัครสมาชิกสำเร็จ แต่เข้าสู่ระบบอัตโนมัติไม่สำเร็จ');
            }
        } catch (error) {
            const errorMessage =
                error instanceof AxiosError
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="register-page">
            <div className="register-container">

                <div className="register-header">
                    <h1>สร้างบัญชีผู้ใช้</h1>
                    <p>เข้าร่วมเพื่อสะสมแต้ม</p>
                </div>
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="register-form">

                        <FormInput
                            name="name"
                            control={control}
                            label="ชื่อ-นามสกุล"
                            placeholder="ชื่อ-นามสกุล"
                        />

                        <FormInput
                            name="username"
                            control={control}
                            label="ชื่อผู้ใช้"
                            placeholder="ชื่อผู้ใช้"
                        />

                        <div className="form-grid">
                            <FormInput
                                name="password"
                                control={control}
                                label="รหัสผ่าน"
                                type="password"
                                placeholder="••••••••"
                            />

                            <FormInput
                                name="confirmPassword"
                                control={control}
                                label="ยืนยันรหัสผ่าน"
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="form-grid">
                            <FormInput
                                name="age"
                                control={control}
                                label="อายุ"
                                type="number"
                                placeholder="อายุ"
                            />

                            <FormSelect
                                name="gender"
                                control={control}
                                label="เพศ"
                                options={[
                                    { value: 'ชาย', label: 'ชาย' },
                                    { value: 'หญิง', label: 'หญิง' },
                                    { value: 'อื่นๆ', label: 'อื่นๆ' },
                                ]}
                            />
                        </div>
                        <div className="register-terms"> การสร้างบัญชีหากมีปัญหาโปรด{' '} <a href="#">ติดต่อเรา</a>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg register-button" disabled={isLoading}>
                            {isLoading ? (
                                <div className="btn-loading">
                                    <svg className="btn-spinner" viewBox="0 0 24 24">
                                        <circle className="spinner-bg" cx="12" cy="12" r="10" strokeWidth="3" fill="none" />
                                        <path className="spinner-fg" d="M4 12a8 8 0 018-8" />
                                    </svg>
                                    <span>...</span>
                                </div>
                            ) : (
                                <span>สร้างบัญชี</span>
                            )}
                        </button>
                    </form>
                </Card>

                <p className="register-login">
                    มีบัญชีผู้ใช้อยู่แล้ว?{' '}
                    <Link href="/auth/login">เข้าสู่ระบบ</Link>
                </p>

            </div>
        </main>
    );
}
