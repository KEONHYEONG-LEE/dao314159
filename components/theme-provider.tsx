"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props} 
      // HTML 클래스에 'dark'를 추가하여 Tailwind의 dark: 접두사가 작동하게 함
      attribute="class" 
      // 기본 테마를 다크로 설정
      defaultTheme="dark" 
      // 시스템 설정(라이트 모드 등)을 따라가지 않도록 비활성화
      enableSystem={false} 
      // 사용자가 변경하려 해도 다크 모드로 강제 고정 (사용자님 요청 사항)
      forcedTheme="dark"
      // 테마 변경 시 발생할 수 있는 레이아웃 틀어짐 방지
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-blue-500/30">
        {children}
      </div>
    </NextThemesProvider>
  );
}
