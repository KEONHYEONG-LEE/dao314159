import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import '../globals.css';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

// 1. 에러 추적용 에러 바운더리 컴포넌트
interface ErrorProps { children: ReactNode; }
interface ErrorState { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null; }

class GlobalErrorBoundary extends Component<ErrorProps, ErrorState> {
  public state: ErrorState = { hasError: false, error: null, errorInfo: null };

  public static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-red-400 p-6 flex flex-col items-center justify-center font-mono">
          <div className="max-w-xl w-full bg-slate-800 p-5 rounded-2xl border border-red-500/40 shadow-2xl space-y-4">
            <h1 className="text-xl font-bold text-red-500 flex items-center gap-2">
              ⚠️ 클라이언트 에러 발생 지점 포착
            </h1>
            <div className="bg-slate-950 p-3 rounded-lg text-xs text-rose-300 overflow-x-auto">
              <strong>에러 메시지:</strong> {this.state.error?.toString()}
            </div>
            <div className="bg-slate-950 p-3 rounded-lg text-[10px] text-slate-400 overflow-x-auto max-h-48">
              <strong>에러 위치 (Stack Trace):</strong>
              <pre className="mt-1 whitespace-pre-wrap">{this.state.errorInfo?.componentStack || this.state.error?.stack}</pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />

      <GlobalErrorBoundary>
        <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden">
          <main>
            <Component {...pageProps} />
          </main>
          <FloatingLanguageSwitcher />
        </div>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}
