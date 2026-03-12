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
import '../globals.css';

const billSchema = z.object({
    name: z.string().min(1, 'กรุณากรอกเชื่อบิล'),
    price: z.number().min(1, 'กรุณากรอกราคาอย่างน้อย 1 บาท'),
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
        formState: { errors }
    } = useForm<BillFormValues>({
        resolver: zodResolver(billSchema),
        defaultValues: {
            name: 'Mala Dinner',
            price: 0,
            redeemPoint: 0
        }
    });

    const price = watch("price");
    const redeemPoint = watch("redeemPoint");



    useEffect(() => {
        const fetchPoints = async () => {
            if (!user?.userId) return;

            try {
                const points = await getCurrentPoints(user.userId);
                setUserPoints(points);
            } catch (err) {
                console.error("Failed to fetch user points", err);
            }
        };

        fetchPoints();
    }, [user]);

    const safePrice = Number(watch("price")) || 0;
    const safeRedeemPoint = Number(watch("redeemPoint")) || 0;
    const pointsToEarn = Math.floor(price * 0.1) || 0;
    const maxRedeemable = Math.min(userPoints, Math.floor(price || 0)) || 0;
    const finalAmount = Math.max(0, price - redeemPoint) || 0;

    const onSubmit = async (data: BillFormValues) => {

        if (!user?.userId) {
            setError("User information missing");
            return;
        }

        setLoading(true);
        setError(null);

        try {

            await createBill({
                userId: user.userId,
                name: data.name,
                price: data.price,
                redeemPoint: data.redeemPoint
            });

            router.push("/");
            router.refresh();

        } catch (err) {

            const message =
                err instanceof AxiosError
                    ? (err.response?.data as { message?: string })?.message || err.message
                    : "Failed to create bill";

            setError(message);

        } finally {
            setLoading(false);
        }

    };

    return (
        <ProtectedRoute>

            <main className="bill-page">

                <div className="bill-container">

                    <div className="bill-header">
                        <h2>สร้างบิล / สะสมแต้ม</h2>
                        <p>ทำรายการเพื่อเพิ่มแต้มสะสมของคุณ</p>
                    </div>

                    <Card className="bill-card">
                        <div className="bill-card-inner">
                            <div className="bill-section-header">
                                <h3>ข้อมูลรายการ</h3>
                                <p>กรุณากรอกรายละเอียดเพื่อคำนวณแต้ม</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="bill-form">

                                {error && (
                                    <div className="bill-error">
                                        {error}
                                    </div>
                                )}

                                <div className="bill-grid">

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
                                        {...register('price', {
                                            valueAsNumber: true,
                                            onChange: (e) => {
                                                if (e.target.value.length > 8) {
                                                    e.target.value = e.target.value.slice(0, 8);
                                                    setValue('price', Number(e.target.value));
                                                }
                                            }
                                        })}
                                        error={errors.price?.message}
                                        max={isNaN(maxRedeemable) ? 0 : maxRedeemable}
                                    />

                                </div>

                                <div className="points-preview">
                                    <div className="points-preview-label">
                                        แต้มที่จะได้รับ (10%)
                                    </div>
                                    <div className="points-preview-value">
                                        {pointsToEarn.toLocaleString()} แต้ม
                                    </div>
                                </div>
                                <div>
                                    <div className="redeem-header">
                                        <label>
                                            ใช้แต้มส่วนลด (สูงสุด: {maxRedeemable})
                                        </label>
                                        <span>
                                            มีอยู่: {userPoints.toLocaleString()} Pts
                                        </span>
                                    </div>
                                    <div className="redeem-input">
                                        <Input
                                            label=""
                                            type="number"
                                            {...register('redeemPoint', { valueAsNumber: true })}
                                            error={errors.redeemPoint?.message}
                                            max={maxRedeemable}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setValue('redeemPoint', isNaN(maxRedeemable) ? 0 : maxRedeemable)}
                                        >
                                            ใช้ทั้งหมด
                                        </Button>
                                    </div>
                                </div>
                                <div className="bill-summary">
                                    <div className="summary-row">
                                        <span>ราคาปกติ</span>
                                        <span>{safePrice.toLocaleString()} ฿</span>
                                    </div>

                                    <div className="summary-row discount">
                                        <span>ส่วนลดจากแต้ม</span>
                                        <span>-{safeRedeemPoint.toLocaleString()} ฿</span>
                                    </div>

                                    <div className="summary-total">
                                        <span>ยอดชำระสุทธิ</span>
                                        <span>{finalAmount.toLocaleString()} ฿</span>
                                    </div>

                                </div>

                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    size="lg"
                                    fullWidth
                                >
                                    ยืนยันและชำระเงิน
                                </Button>

                            </form>

                        </div>

                    </Card>

                    <div className="bill-cancel">

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/")}
                        >
                            ยกเลิกและกลับหน้าหลัก
                        </Button>

                    </div>

                </div>

            </main>

        </ProtectedRoute>
    );
}