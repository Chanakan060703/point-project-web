'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { createBill } from '@/lib/bill';
import { getCurrentPoints } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Receipt, Sparkles, Coins, Wallet } from 'lucide-react';

const billSchema = z.object({
    name: z.string().min(1, 'Please enter a bill name'),
    price: z.number().min(1, 'Price must be at least 1'),
    redeemPoint: z.number().min(0),
});

type BillFormValues = z.infer<typeof billSchema>;

export default function BillPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userPoints, setUserPoints] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BillFormValues>({
        resolver: zodResolver(billSchema),
        defaultValues: {
            name: 'Mala Dinner',
            price: 0,
            redeemPoint: 0,
        },
    });

    const price = watch('price');
    const redeemPoint = watch('redeemPoint');

    useEffect(() => {
        const fetchPoints = async () => {
            if (!user?.userId) return;
            try {
                const points = await getCurrentPoints(user.userId);
                setUserPoints(points);
            } catch (error) {
                console.error('Failed to fetch user points', error);
            }
        };
        fetchPoints();
    }, [user]);

    const pointsToEarn = Math.floor(price * 0.1);
    const maxRedeemable = Math.min(userPoints, Math.floor(price));
    const finalAmount = Math.max(0, price - redeemPoint);

    const onSubmit = async (data: BillFormValues) => {
        if (!user?.userId) {
            setError('User information is missing. Please log in again.');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            userId: user.userId,
            name: data.name,
            price: data.price,
            redeemPoint: data.redeemPoint,
        };

        console.log('[Bill Submission] Sending payload:', payload);

        try {
            await createBill(payload);
            router.push('/');
            router.refresh();
        } catch (error) {
            const message =
                error instanceof AxiosError
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : 'Failed to create bill';

            console.error('[Bill Submission] Error:', error);
            setError(message === 'Unauthorized' ? 'Session expired. Please log in again.' : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-950 dark:via-indigo-950/20 dark:to-purple-950/20 overflow-hidden py-16 px-6">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
                </div>

                <div className="relative flex flex-col items-center">
                    <div className="w-full max-w-lg space-y-8">
                        <div className="text-center space-y-2 mb-4">
                            <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                สร้างบิล / สะสมแต้ม
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">ทำรายการเพื่อเพิ่มแต้มสะสมของคุณ</p>
                        </div>

                        <Card gradient className="borderGlow overflow-hidden p-0">
                            <div className="bg-gradient-to-r from-indigo-600/5 to-purple-600/5 p-8 pb-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <Receipt className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold dark:text-white">ข้อมูลรายการ</h3>
                                        <p className="text-xs text-gray-500">กรุณากรอกรายละเอียดเพื่อคำนวณแต้ม</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {error && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="ชื่อรายการ / อาหาร"
                                            placeholder="เช่น หมาล่าเผ็ดชา"
                                            {...register('name')}
                                            error={errors.name?.message}
                                        />

                                        <Input
                                            label="ราคาตามบิล (บาท)"
                                            type="number"
                                            placeholder="0.00"
                                            {...register('price', { valueAsNumber: true })}
                                            error={errors.price?.message}
                                        />
                                    </div>

                                    <div className="relative p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white overflow-hidden shadow-xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                        <div className="relative z-10 flex justify-between items-center">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-indigo-100 text-xs font-semibold uppercase tracking-wider">
                                                    <Sparkles className="w-3 h-3" />
                                                    แต้มที่จะได้รับ (10%)
                                                </div>
                                                <div className="text-3xl font-black">+{pointsToEarn.toLocaleString()} <span className="text-lg font-bold opacity-80">แต้ม</span></div>
                                            </div>
                                            <Coins className="w-10 h-10 text-white/20" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                                <Wallet className="w-4 h-4 text-indigo-500" />
                                                ใช้แต้มส่วนลด (สูงสุด: {maxRedeemable})
                                            </label>
                                            <span className="text-[11px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 uppercase">
                                                มีอยู่: {userPoints.toLocaleString()} Pts
                                            </span>
                                        </div>
                                        <div className="flex gap-3">
                                            <Input
                                                label=""
                                                type="number"
                                                className="flex-1"
                                                {...register('redeemPoint', { valueAsNumber: true })}
                                                error={errors.redeemPoint?.message}
                                                max={maxRedeemable}
                                            />
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => setValue('redeemPoint', maxRedeemable)}
                                                className="whitespace-nowrap px-6"
                                            >
                                                Max
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-900/50 -mx-8 px-8 py-6 space-y-4">
                                        <div className="flex justify-between text-sm font-medium text-gray-500">
                                            <span>ราคาปกติ</span>
                                            <span>{price.toLocaleString()} ฿</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium text-red-500">
                                            <span>ส่วนลดจากแต้ม</span>
                                            <span>-{redeemPoint.toLocaleString()} ฿</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <span className="text-lg font-bold dark:text-white">ยอดชำระสุทธิ</span>
                                            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                                                {finalAmount.toLocaleString()} <span className="text-xl">฿</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pb-8">
                                        <Button type="submit" className="w-full shadow-xl shadow-indigo-500/20" isLoading={loading} size="lg">
                                            ยืนยันและชำระเงิน
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>

                        <div className="flex justify-center">
                            <Button variant="ghost" onClick={() => router.push('/')} size="sm" className="text-gray-400 hover:text-indigo-600">
                                ยกเลิกและกลับหน้าหลัก
                            </Button>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
                  @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
            </main>
        </ProtectedRoute>
    );
}
