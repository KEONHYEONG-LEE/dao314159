import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPNR - Global Pi Newsroom",
  description: "AI로 요약하는 파이 네트워크 실시간 뉴스 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
