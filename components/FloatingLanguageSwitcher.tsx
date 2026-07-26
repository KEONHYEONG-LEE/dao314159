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

    // 구글 기본 UI 배너 강제 숨기기 스타일
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame { 
        display: none !important; 
        visibility: hidden !important;
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
    
    // 1. 모든 경로와 도메인의 구글 번역 쿠키를 싹 다 밀어버립니다.
    const domains = [window.location.hostname, "." + window.location.hostname, ""];
    domains.forEach(domain => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ""}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/html;${domain ? ` domain=${domain};` : ""}`;
    });

    if (langCode === 'en') {
      // 영어 선택 시: 메인 홈 주소로 클린 새로고침
      window.location.href = window.location.origin;
    } else {
      // 다국어 선택 시: 새로운 쿠키를 주입하여 구글 번역 강제 갱신 유도
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
      
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event("change"));
        setCurrentLang(langCode);
      }
      
      // 화면 전환을 확실하게 적용하기 위한 즉시 새로고침
      window.location.reload();
    }
    setIsOpen(false);
  };

  const currentLabel = LANGUAGES.find(l => l.code === currentLang)?.label || "English";

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 max-h-60 w-36 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-md">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm font-semibold transition-colors ${
                currentLang === lang.code ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-transform active:scale-95"
      >
        <Globe size={18} />
        <span>{currentLabel}</span>
        <ChevronUp size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
