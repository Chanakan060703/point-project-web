'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { logout as apiLogout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PointDashboard } from "@/components/PointDashboard";
import "./globals.css";

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
    <main className="home-page">
      <div className="home-container">
        <Card className="home-card">
          <div className="home-content">
            <h1 className="home-title">
              หม่าล่าเชิงดอย
            </h1>

            <div className="home-actions">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => router.push('/bill')}
                    size="lg"
                    fullWidth
                  >
                    ออกบิล / รับแต้ม
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => router.push('/transaction')}
                    size="lg"
                    fullWidth
                  >
                    ดูประวัติการใช้งาน
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    size="sm"
                    className="logout-btn"
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
                  >
                    เข้าสู่ระบบ
                  </Button>

                  <Button
                    onClick={() => router.push('/register')}
                    variant="secondary"
                    size="lg"
                    fullWidth
                  >
                    สมัคร สมาชิกใหม่
                  </Button>
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