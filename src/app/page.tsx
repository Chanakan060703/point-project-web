'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { logout as apiLogout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { PointDashboard } from "@/components/PointDashboard";
import "./globals.css";

export default function Home() {
  const { user, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    apiLogout();
    storeLogout();
    router.replace('/');
  };

  const isAuthenticated = Boolean(user);
  return (
    <main className="home-page">
      <div className="home-container">
        <Card className="home-card">
          <div className="home-content">
            <h1 className="home-title">
              หม่าล่าเชียงดอย
            </h1>
            <div className="home-actions">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push('/bill')}
                    className="btn btn-primary btn-lg btn-full"
                  >
                    ออกบิล / รับแต้ม
                  </button>

                  <button
                    onClick={() => router.push('/transaction')}
                    className="btn btn-secondary btn-lg btn-full"
                  >
                    ดูประวัติการใช้งาน
                  </button>

                  <button
                    onClick={() => handleLogout()}
                    className="btn btn-ghost btn-sm logout-btn"
                  >
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="btn btn-primary btn-lg btn-full"
                  >
                    เข้าสู่ระบบ
                  </button>

                  <button
                    onClick={() => router.push('/auth/register')}
                    className="btn btn-secondary btn-lg btn-full"
                  >
                    สมัครสมาชิกใหม่
                  </button>
                </>
              )}
            </div>
          </div>
        </Card>

        {isAuthenticated && (
          <PointDashboard />
        )}
        {!isAuthenticated && (
          <Card className="promo-card">
            <div className="promo-badge">
              โปรโมชั่นพิเศษ
            </div>
            <h3 className="promo-title">
              รับแต้มสะสม 10%
            </h3>
            <p className="promo-text">
              ทุกออเดอร์ เพื่อใช้เป็นส่วนลดแทนเงินสดได้ทันที
            </p>
          </Card>
        )}

      </div>

    </main>
  );
}
