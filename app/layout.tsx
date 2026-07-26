import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPNR App",
  description: "Tailwind CSS가 적용된 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

