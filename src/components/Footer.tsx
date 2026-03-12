'use client';

import React from 'react';
import Link from 'next/link';
import '../app/globals.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="logo-text">
                หม่าล่าเชิงดอย
              </span>
            </Link>
            <p className="footer-description">
              สัมผัสรสชาติหมาล่าแท้ๆ พร้อมระบบสะสมแต้มที่คุ้มค่าที่สุดในย่าน....
              มาร่วมเป็นส่วนหนึ่งของครอบครัวเราได้แล้ววันนี้
            </p>
          </div>

          <div className="footer-section">
            <h4>สำรวจ</h4>
            <ul>
              <li><Link href="/">หน้าแรก</Link></li>
              <li><Link href="/bill">ออกบิลสะสมแต้ม</Link></li>
              <li><Link href="/transaction">ประวัติการใช้งาน</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>ติดต่อเรา</h4>
            <ul>
              <li>
                <span className="footer-label">Email Support</span>
                <span>contact@malachengdoi.com</span>
              </li>
              <li>
                <span className="footer-label">Location</span>
                <span>เชิงดอย, เชียงใหม่, Thailand</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Mala Cheng Doi. All rights reserved.</p>
          <div>
            MADE FOR MALA LOVERS
          </div>
        </div>
      </div>
    </footer>
  );
};