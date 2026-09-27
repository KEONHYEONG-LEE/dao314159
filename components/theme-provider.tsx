// @ts-nocheck
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // SSR 및 Hydration Mismatch 원천 차단
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
      disableTransitionOnChange
      {...props}
    >
      <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-purple-500/30 font-sans antialiased">
        {mounted ? children : <div className="opacity-0">{children}</div>}
      </div>
    </NextThemesProvider>
  );
}

export default ThemeProvider;
