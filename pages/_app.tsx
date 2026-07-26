import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script'; // Next.js 전용 스크립트 컴포넌트
import { ThemeProvider } from 'next-themes';
import '../globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" /> 
        {/* 모바일에서 줌 현상 방지 설정 추가 */}
      </Head>

      {/* Pi SDK 로드 최적화 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="beforeInteractive" 
      />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}
