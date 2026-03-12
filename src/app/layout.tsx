'use client';

import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans-thai",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname === '/auth/login' || pathname === '/auth/register';
  return (
    <html lang="en">
      <body className={`${ibmPlexSansThai.variable} `}>
        {!hideHeaderFooter && <Header />}
        <main className="flex-grow">
          {children}
        </main>
        {!hideHeaderFooter && <Footer />}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}