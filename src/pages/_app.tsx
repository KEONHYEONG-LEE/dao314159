import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import '../globals.css';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const removeGoogleBar = () => {
      const selectors = [
        '.goog-te-banner-frame',
        '.goog-te-banner',
        '.VIpgJd-Zvi9m-OR9h3-zh99gd',
        'iframe.skiptranslate'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => (el as HTMLElement).style.setProperty('display', 'none', 'important'));
      });
    };

    const observer = new MutationObserver(removeGoogleBar);
    if (document.body) {
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />

        {/* 구글 순정 번역 위젯 UI 숨김 전용 스타일 */}
        <style key="google-translate-override">{`
          .goog-te-gadget, .goog-te-gadget-simple, .goog-te-menu-frame, 
          .VIpgJd-yD22b-y03Lfd, .VIpgJd-yD22b-y03Lfd-v922d, #goog-gt-tt, 
          .goog-te-balloon-frame { 
            display: none !important; 
            visibility: hidden !important; 
            opacity: 0 !important; 
            pointer-events: none !important; 
            height: 0 !important; 
            width: 0 !important; 
          } 
          body { 
            top: 0px !important; 
            position: static !important; 
          }
        `}</style>
      </Head>

      {/* 파이 SDK 스크립트 */}
      <Script
        src="https://sdk.minepi.com/pi-sdk.js"
        strategy="afterInteractive"
      />

      {/* 구글 번역 엔진 초기화 (인라인 스크립트 안전화) */}
      <Script
        id="google-translate-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,ko,ja,zh-CN,es,vi',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            }
          `,
        }}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden">
        <main>
          <Component {...pageProps} />
        </main>

        {/* 백그라운드용 번역 엔진 영역 */}
        <div id="google_translate_element" style={{ display: 'none', width: 0, height: 0, overflow: 'hidden' }}></div>

        {/* 클라이언트 마운트 완료 후에만 스위처 노출 */}
        {mounted && <FloatingLanguageSwitcher />}
      </div>
    </ThemeProvider>
  );
}
