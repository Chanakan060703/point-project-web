'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/Card";
import { getTransactions, Transaction } from '@/lib/transaction';
import { useAuthStore } from '@/store/useAuthStore';
import { History, User } from 'lucide-react';
import '../globals.css';

export default function TransactionPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getTransactions();
                if (isAdmin) {
                    setTransactions(data);
                } else {
                    setTransactions(
                        data.filter(tx => tx.userId === Number(user?.userId))
                    );
                }
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [user, isAdmin]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <ProtectedRoute>
            <main className="transaction-page">
                <div className="transaction-container">
                    <div className="transaction-header">
                        <h2>ประวัติการใช้งาน</h2>
                        <p>
                            {isAdmin
                                ? 'รายการทั้งหมดในระบบ'
                                : 'รวมรายการสะสมและใช้แต้มทั้งหมดของคุณ'}
                        </p>
                    </div>
                    {loading ? (
                        <div className="transaction-loading">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="transaction-skeleton" />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <Card className="transaction-empty">
                            <div className="empty-icon">
                                <History size={32} />
                            </div>
                            <p>ยังไม่มีรายการในขณะนี้</p>
                            {isAdmin && (
                                <button
                                    onClick={() => router.push("/bill")}
                                    className="btn btn-primary btn-lg"
                                >
                                    สร้างบิลให้ลูกค้า
                                </button>
                            )}
                            {!isAdmin && (
                                <button
                                    onClick={() => router.push("/bill")}
                                    className="btn btn-primary btn-lg"
                                >
                                    ออกบิลใบแรกเลย
                                </button>
                            )}
                        </Card>
                    ) : (

                        <div className="transaction-list">
                            {transactions.map(tx => (
                                <Card key={tx.id} className="transaction-item">
                                    <div className="transaction-row">
                                        <div className="transaction-info">
                                            <div className="transaction-meta">
                                                <span
                                                    className={
                                                        tx.type === "EARN"
                                                            ? "badge badge-earn"
                                                            : "badge badge-spend"
                                                    }
                                                >
                                                    {tx.type === "EARN" ? "ได้รับแต้ม" : "ใช้แต้ม"}
                                                </span>
                                                <span className="transaction-date">
                                                    {formatDate(tx.createdAt)}
                                                </span>
                                            </div>
                                            <h3>
                                                {tx.bill?.name || "Mala Order"}
                                            </h3>
                                            {tx.bill && (
                                                <p>
                                                    ยอดชำระ: {Number(tx.bill.amount).toLocaleString()} ฿
                                                </p>
                                            )}
                                            {isAdmin && tx.user && (
                                                <p className="transaction-user">
                                                    <User size={14} />
                                                    {tx.user.username}
                                                </p>
                                            )}
                                        </div>
                                        <div
                                            className={tx.type === "EARN" ? "transaction-point earn" : "transaction-point spend"}
                                        >
                                            {tx.point.toLocaleString()} แต้ม
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                    <div className="transaction-back">
                        <button
                            onClick={() => router.push("/")}
                            className="btn btn-ghost btn-sm"
                        >
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
