'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { logout as apiLogout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PointDashboard } from "@/components/PointDashboard";
import { Sparkles, Receipt, History, ArrowRight, Flame } from "lucide-react";

export default function Home() {
  const { user, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    apiLogout();
    storeLogout();
    router.refresh();
  };

  const isAuthenticated = !!user;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-950 dark:via-indigo-950/20 dark:to-purple-950/20 overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/5 to-purple-300/5 rounded-full blur-2xl" />
      </div>

      <div className="relative flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-2xl space-y-10">

          <Card className="text-center space-y-10 py-16 borderGlow" gradient>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-[float_3s_ease-in-out_infinite]">
                    <Flame className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  หมาล่าเชิงดอย
                </h1>
                <div className="flex items-center justify-center gap-2 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-md mx-auto leading-relaxed">
                  {isAuthenticated
                    ? <span>👋 สวัสดีคุณ <span className="font-bold text-indigo-600 dark:text-indigo-400">{user?.username}</span><br />พร้อมสะสมแต้มรับรางวัลสุดพิเศษหรือยัง?</span>
                    : "🔥 สัมผัสรสชาติหมาล่าแท้ๆ พร้อมระบบสะสมแต้มที่คุ้มค่าที่สุดในย่านเชิงดอย"
                  }
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => router.push('/bill')}
                    size="lg"
                    fullWidth
                    leftIcon={<Receipt className="w-5 h-5" />}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    ออกบิล / รับแต้ม
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/transaction')}
                    size="lg"
                    fullWidth
                    leftIcon={<History className="w-5 h-5" />}
                  >
                    ดูประวัติการใช้งาน
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => router.push('/login')}
                    size="lg"
                    fullWidth
                    className="shadow-xl"
                  >
                    เข้าสู่ระบบ
                  </Button>
                  <Button
                    onClick={() => router.push('/register')}
                    variant="secondary"
                    size="lg"
                    fullWidth
                  >
                    สมัครสมาชิกใหม่
                  </Button>
                </>
              )}
            </div>
          </Card>

          {isAuthenticated && (
            <div className="animate-[fadeInUp_0.5s_ease-out]">
              <PointDashboard />
            </div>
          )}

          {!isAuthenticated && (
            <div className="animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4">
                    <Sparkles className="w-3 h-3" />
                    โปรโมชั่นพิเศษ
                  </div>
                  <h3 className="text-2xl font-black mb-2">รับแต้มสะสม 10%</h3>
                  <p className="text-indigo-100 text-sm">ทุกออเดอร์ เพื่อใช้เป็นส่วนลดแทนเงินสดได้ทันที</p>
                  <div className="mt-6 flex justify-center gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-8 bg-white/30 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}