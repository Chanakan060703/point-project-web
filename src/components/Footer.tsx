import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-black border-t border-gray-100/50 dark:border-gray-800/50 py-20 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-indigo-500/10">
                M
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                หมาล่าเชิงดอย
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm font-medium leading-relaxed">
              สัมผัสรสชาติหมาล่าแท้ๆ พร้อมระบบสะสมแต้มที่คุ้มค่าที่สุดในย่านเชิงดอย มาร่วมเป็นส่วนหนึ่งของครอบครัวเราได้แล้ววันนี้
            </p>
          </div>

          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-xs">สำรวจ</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link href="/" className="hover:text-indigo-600 transition-all hover:pl-1">หน้าแรก</Link></li>
              <li><Link href="/bill" className="hover:text-indigo-600 transition-all hover:pl-1">ออกบิลสะสมแต้ม</Link></li>
              <li><Link href="/transaction" className="hover:text-indigo-600 transition-all hover:pl-1">ประวัติการใช้งาน</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-xs">ติดต่อเรา</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-gray-400 font-black">Email Support</span>
                <span>contact@malachengdoi.com</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-gray-400 font-black">Location</span>
                <span>เชิงดอย, เชียงใหม่, Thailand</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <p>© 2026 Mala Cheng Doi. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              MADE WITH <span className="text-rose-500 animate-pulse text-xs">❤️</span> FOR MALA LOVERS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
