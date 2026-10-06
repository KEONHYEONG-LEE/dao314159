"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";
import { usePiStorage } from "../hooks/usePiStorage";

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
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang, isLoaded] = usePiStorage<string>("gpnr_lang", "ko");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mounted) return;

    const styleId = "gpnr-google-translate-hide-style";
    let style = document.getElementById(styleId) as HTMLStyleElement;

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame,
        .VIpgJd-yD22b-y03Lfd, .VIpgJd-yD22b-y03Lfd-v922d,
        .goog-te-gadget-icon, .goog-te-gadget, #google_translate_element,
        .skiptranslate, iframe.goog-te-banner-frame { 
          display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;
        }
        body { top: 0 !important; position: static !important; }
      `;
      document.head.appendChild(style);
    }

    if (currentLang && currentLang !== "en") {
      const timer = setTimeout(() => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (combo && combo.value !== currentLang) {
          combo.value = currentLang;
          combo.dispatchEvent(new Event("change"));
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentLang, isLoaded, mounted]);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";
    const domains = [hostname, "." + hostname, ""];
    
    domains.forEach(domain => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ""}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/html;${domain ? ` domain=${domain};` : ""}`;
    });

    if (langCode === 'en') {
      if (typeof window !== "undefined") {
        window.location.href = window.location.origin;
      }
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      if (hostname) {
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname};`;
      }
      
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event("change"));
      }
      
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 100);
    }
    setIsOpen(false);
  };

  if (!mounted) return null;

  const currentLabel = LANGUAGES.find(l => l.code === currentLang)?.label || "English";

  return (
    <div id="gpnr-floating-lang-switcher" className="fixed bottom-20 right-5 z-[999999] flex flex-col items-end isolate select-none notranslate" translate="no">
      {isOpen && (
        <div className="mb-2 max-h-60 w-36 overflow-y-auto rounded-2xl border border-slate-700/80 bg-[#1e293b] p-1.5 shadow-2xl backdrop-blur-xl notranslate" translate="no">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageChange(lang.code);
              }}
              className={`w-full rounded-xl px-3.5 py-2 text-left text-xs font-semibold transition-colors notranslate ${
                currentLang === lang.code ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
              }`}
              translate="no"
            >
              <span className="notranslate" translate="no" suppressHydrationWarning>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      )}
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        type="button"
        className="relative z-10 flex h-11 items-center gap-2 rounded-full bg-blue-600 px-4 text-xs font-bold text-white shadow-xl hover:bg-blue-500 active:scale-95 border border-blue-400/30 notranslate"
        translate="no"
      >
        <Globe size={16} />
        <span className="notranslate" translate="no" suppressHydrationWarning>
          {currentLabel}
        </span>
        <ChevronUp size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
