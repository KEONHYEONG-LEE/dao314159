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

    // 구글 번역 기본 상단 바 및 팝업 프레임 강제 제거
    const removeGoogleBar = () => {
      const selectors = [
        '.goog-te-banner-frame', 
        '.goog-te-banner', 
        '.VIpgJd-Zvi9m-OR9h3-zh99gd', 
        'iframe.skiptranslate',
        '.goog-te-spinner-pos'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
          }
        });
      });

      if (document.body && document.body.style.top !== '0px') {
        document.body.style.setProperty('top', '0px', 'important');
      }
    };

    removeGoogleBar();
    const observer = new MutationObserver(removeGoogleBar);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        
        {/* 구글 순정 번역 위젯 UI 숨김 및 레이아웃 이격 방지 CSS */}
        <style key="google-translate-override">{`
          .goog-te-gadget,
          .goog-te-gadget-simple,
          .goog-te-menu-frame,
          .VIpgJd-yD22b-y03Lfd,
          .VIpgJd-yD22b-y03Lfd-v922d,
          #goog-gt-tt,
          .goog-te-balloon-frame,
          .goog-text-highlight {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            box-shadow: none !important;
          }
          body {
            top: 0px !important;
            position: static !important;
          }
          /* 번역 스크립트 실행 시 텍스트 하이라이트 배경색 제거 */
          font {
            background-color: transparent !important;
            box-shadow: none !important;
          }
        `}</style>
      </Head>

      {/* 파이 SDK 스크립트 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive"
      />

      {/* 구글 번역 엔진 초기화 */}
      <Script id="google-translate-config" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            if (window.google && window.google.translate) {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,ko,ja,zh-CN,es,vi',
                autoDisplay: false
              }, 'google_translate_element');
            }
          }
        `}
      </Script>
      <Script 
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden relative">
        <main>
          <Component {...pageProps} />
        </main>
        
        {/* 백그라운드용 번역 엔진 영역 (숨김) */}
        <div id="google_translate_element" style={{ display: 'none', width: 0, height: 0, overflow: 'hidden' }} />
        
        {/* 커스텀 플로팅 언어 스위처 */}
        {mounted && <FloatingLanguageSwitcher />}
      </div>
    </ThemeProvider>
  );
}
