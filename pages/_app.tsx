import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import '../globals.css';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 구글 번역 기본 상단 바 디자인을 숨기고 모바일 레이아웃 밀림을 방지하는 최적화 스크립트
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

      if (document.body.style.top !== '0px') {
        document.body.style.top = '0px !important';
      }
    };

    const observer = new MutationObserver(removeGoogleBar);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* 파이 SDK 스크립트 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive"
      />

      {/* [업데이트] 새로 추가한 다국어 코드를 엔진에 등록하여 정상 작동 유도 */}
      <Script id="google-translate-config" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,ko,ja,zh-CN,es,vi',
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}
      </Script>
      <Script 
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden">
        {/* [중복 차단] 상단 헤더 이중 호출은 완전히 배제하여 겹침 현상 해결 */}
        <main>
          <Component {...pageProps} />
        </main>
        
        {/* [복구] 원본 구글 번역 엔진 위젯 백그라운드 구동 */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        
        {/* [복구] 화면 하단에 뜨는 한국어 번역 활성화 스위처 버튼 */}
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
