// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Youtube, Twitter, Facebook, Instagram, Mail } from "lucide-react";

const FOOTER_TEXTS = {
  ko: {
    desc: "Global Pi Newsroom (GPNR)은 파이 네트워크 생태계의 최신 뉴스, 글로벌 분석 및 커뮤니티 소식을 전달하는 전문 뉴스로룸입니다.",
    quickLinks: "빠른 링크",
    about: "GPNR 소개",
    privacy: "개인정보 처리방침",
    terms: "이용약관",
    contact: "문의하기",
    rights: "GPNR - Global Pi Newsroom. All rights reserved."
  },
  en: {
    desc: "Global Pi Newsroom (GPNR) is your premier source for the latest updates, analysis, and community news within the Pi Network ecosystem.",
    quickLinks: "Quick Links",
    about: "About Us",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    contact: "Contact",
    rights: "GPNR - Global Pi Newsroom. All rights reserved."
  }
};

export default function Footer({ language }: { language?: string }) {
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<"ko" | "en">("en");

  // SSR 불일치 방지 및 언어 상태 로드
  useEffect(() => {
    setMounted(true);
    if (language && (language === "ko" || language === "en")) {
      setCurrentLang(language as "ko" | "en");
    } else if (typeof window !== "undefined") {
      try {
        const savedLang = localStorage.getItem("gpnr_lang") || localStorage.getItem("pi_lang") || localStorage.getItem("language");
        if (savedLang === "ko" || savedLang === "en") {
          setCurrentLang(savedLang as "ko" | "en");
        }
      } catch (e) {
        console.warn("Language setting load error in Footer:", e);
      }
    }
  }, [language]);

  if (!mounted) return null;

  const t = FOOTER_TEXTS[currentLang] || FOOTER_TEXTS.en;

  return (
    <footer className="bg-slate-900 text-white py-12 mt-12 border-t border-slate-800/80">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 브랜딩 및 소개 */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-black tracking-wider text-blue-400 mb-4">GPNR</h2>
            <p className="text-slate-400 mb-6 max-w-md text-sm leading-relaxed">
              {t.desc}
            </p>

            {/* 소셜 미디어 링크 */}
            <div className="flex space-x-4">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-400 active:scale-95 transition-all cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-500 active:scale-95 transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Youtube"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-500 active:scale-95 transition-all cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm tracking-wide uppercase mb-4 text-slate-200">{t.quickLinks}</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors cursor-pointer block">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors cursor-pointer block">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors cursor-pointer block">
                  {t.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm tracking-wide uppercase mb-4 text-slate-200">{t.contact}</h3>
            <div className="flex items-center space-x-2.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
              <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <a href="mailto:contact@gpnr.news" className="hover:underline cursor-pointer">
                contact@gpnr.news
              </a>
            </div>
          </div>

        </div>

        {/* 저작권 표시 */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 text-center text-slate-500 text-xs">
          <p>© 2026 {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
