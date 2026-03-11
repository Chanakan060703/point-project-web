import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Point - Secure Authentication",
  description: "A premium point management system with secure JWT authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
