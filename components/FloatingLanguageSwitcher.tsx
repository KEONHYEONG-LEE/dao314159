"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

// 지원할 다국어 리스트 정의
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh-CN", label: "简体中文" },
  { code: "es", label: "Español" },
  { code: "vi", label: "Tiếng Việt" },
];

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // 초기 저장된 언어 로드
    const savedLang = localStorage.getItem("gpnr_lang") || "en";
    setCurrentLang(savedLang);

    // 구글 번역 위젯 및 외부 스위처 아이콘 완벽 숨김 처리
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, 
      #goog-gt-tt, 
      .goog-te-balloon-frame,
      .VIpgJd-yD22b-y03Lfd,
      .VIpgJd-yD22b-y03Lfd-v922d,
      .goog-te-gadget-icon,
      .goog-te-gadget,
      #google_translate_element,
      .skiptranslate,
      iframe.goog-te-banner-frame { 
        display: none !important; 
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        position: absolute !important;
        left: -9999px !important;
      }
      body { top: 0 !important; position: static !important; }
    `;
    document.head.appendChild(style);

    // 영어가 아닐 때 구글 번역 셀렉터 제어
    if (savedLang !== "en") {
      const timer = setTimeout(() => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (combo) {
          combo.value = savedLang;
          combo.dispatchEvent(new Event("change"));
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    localStorage.setItem("gpnr_lang", langCode);
    
    // 쿠키 제거
    const domains = [window.location.hostname, "." + window.location.hostname, ""];
    domains.forEach(domain => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ""}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/html;${domain ? ` domain=${domain};` : ""}`;
    });

    if (langCode === 'en') {
      window.location.href = window.location.origin;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
      
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event("change"));
        setCurrentLang(langCode);
      }
      
      window.location.reload();
    }
    setIsOpen(false);
  };

  const currentLabel = LANGUAGES.find(l => l.code === currentLang)?.label || "English";

  return (
    // 브라우저 기본 번역 버튼과 겹치지 않도록 bottom-20으로 위치 조정
    <div className="fixed bottom-20 right-5 z-[99999] flex flex-col items-end isolate select-none">
      {isOpen && (
        <div className="mb-2 max-h-60 w-36 overflow-y-auto rounded-2xl border border-slate-700/80 bg-[#1e293b]/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full rounded-xl px-3.5 py-2 text-left text-xs font-semibold transition-colors ${
                currentLang === lang.code ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 flex h-11 items-center gap-2 rounded-full bg-blue-600 px-4 text-xs font-bold text-white shadow-xl shadow-blue-950/50 hover:bg-blue-500 transition-all active:scale-95 border border-blue-400/30"
      >
        <Globe size={16} />
        <span>{currentLabel}</span>
        <ChevronUp size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
