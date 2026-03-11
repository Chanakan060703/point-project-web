'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { getTransactions, Transaction } from '@/lib/transaction';
import { useAuthStore } from '@/store/useAuthStore';
import { History } from 'lucide-react';

export default function TransactionPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.filter((transaction) => transaction.userId === Number(user?.userId)));
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchTransactions();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                ประวัติการใช้งาน
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium">รวมรายการสะสมและใช้แต้มทั้งหมดของคุณ</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse h-28 borderGlow" gradient />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <Card gradient borderGlow className="text-center py-16 space-y-6">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
                  <History className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">ยังไม่มีรายการในขณะนี้</p>
                <Button
                  onClick={() => router.push('/bill')}
                  variant="primary"
                  size="lg"
                  className="shadow-lg"
                >
                  ออกบิลใบแรกเลย
                </Button>
              </Card>
            ) : (
              <div className="space-y-4 animate-[fadeInUp_0.5s_ease-out]">
                {transactions.map((tx) => (
                  <Card key={tx.id} gradient className="p-6 transition-all hover:scale-[1.02] borderGlow">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${tx.type === 'EARN'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}>
                            {tx.type === 'EARN' ? 'ได้รับแต้ม' : 'ใช้แต้ม'}
                          </span>
                          <span className="text-[11px] font-medium text-gray-400">{formatDate(tx.createdAt)}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {tx.bill?.name || 'Mala Order'}
                        </h3>
                        {tx.bill && (
                          <p className="text-xs font-medium text-gray-500">ยอดชำระ: {Number(tx.bill.amount).toLocaleString()} ฿</p>
                        )}
                      </div>
                      <div className={`text-2xl font-black ${tx.type === 'EARN' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {tx.type === 'EARN' ? '+' : '-'}{tx.point.toLocaleString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="pt-4 flex justify-center">
              <Button variant="ghost" onClick={() => router.push('/')} size="sm" className="text-gray-400 hover:text-indigo-600">
                กลับหน้าหลัก
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
