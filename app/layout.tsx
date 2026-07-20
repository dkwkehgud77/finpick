import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "핀픽 - 주식한입",
  description: "온톨로지 기반 연쇄영향 분석으로 주식 이슈를 한입에 이해하는 앱",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full justify-center bg-slate-200 dark:bg-black">
        <div className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-background sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[2rem] sm:shadow-2xl">
          <main className="flex-1 overflow-y-auto">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
