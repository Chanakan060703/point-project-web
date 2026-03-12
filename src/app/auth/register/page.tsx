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
import '../../globals.css';

const registerSchema = z.object({
    name: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล'),
    username: z.string().min(3, 'กรุณากรอกชื่อผู้ใช้'),
    password: z.string().min(6, 'กรุณากรอกรหัสผ่าน'),
    confirmPassword: z.string().min(6, 'กรุณากรอกยืนยันรหัสผ่าน'),
    age: z
        .string()
        .min(1, 'กรุณากรอกอายุ')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'กรุณากรอกเฉพาะตัวเลข',
        }),
    gender: z.string().min(1, 'กรุณาเลือกเพศ'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ถูกต้อง",
    path: ['ยืนยันรหัสผ่าน'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();

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
                                label="ยืนยัน รหัสผ่าน"
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

                        <div className="register-terms">
                            การสร้างบัญชีหากมีปัญหาโปรด{' '}
                            <a href="#">ติดต่อเรา</a>
                        </div>

                        <Button
                            type="submit"
                            className="register-button"
                            isLoading={isLoading}
                            size="lg"
                        >
                            สร้างบัญชี
                        </Button>

                    </form>
                </Card>

                <p className="register-login">
                    หากมีบัญชีผู้ใช้สามารถ?{' '}
                    <Link href="/login">เข้าสู่ระบบ</Link>
                </p>

            </div>
        </main>
    );
}