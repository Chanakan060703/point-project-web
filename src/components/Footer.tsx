import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                M
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                หม่าล่าเชิงดอย
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
              สัมผัสรสชาติหมาล่าแท้ๆ พร้อมระบบสะสมแต้มที่คุ้มค่าที่สุดในย่านเชิงดอย มาร่วมเป็นส่วนหนึ่งของครอบครัวเราได้แล้ววันนี้
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase">สำรวจ</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600">หน้าแรก</Link></li>
              <li><Link href="/bill" className="hover:text-blue-600">ออกบิลสะสมแต้ม</Link></li>
              <li><Link href="/transaction" className="hover:text-blue-600">ประวัติการใช้งาน</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase">ติดต่อเรา</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold">Email Support</span>
                <span>contact@malachengdoi.com</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold">Location</span>
                <span>เชิงดอย, เชียงใหม่, Thailand</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2026 Mala Cheng Doi. All rights reserved.</p>
          <div className="flex gap-4">
            <span>MADE FOR MALA LOVERS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
