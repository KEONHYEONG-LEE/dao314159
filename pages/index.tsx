// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { GpnrHeader } from "../components/gpnr-header";
import { CategoryTabs } from "../components/category-tabs";
import { CategoryNews } from "../components/category-news";
import { PiCalendar } from "../components/pi-calendar"; 
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { translations } from "../lib/translations";
import { NEWS_CATEGORIES } from "../lib/categories";

const CATEGORIES = Array.isArray(NEWS_CATEGORIES) ? NEWS_CATEGORIES.map(c => c.id) : [];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('top-news');
  const [currentLang, setCurrentLang] = useState('ko');

  const { user, isAuthenticated, isLoading, loginWithKycId, logout } = usePiNetworkAuthentication();

  const [inputKycId, setInputKycId] = useState("");
  const [inputError, setInputError] = useState("");

  const t = translations[currentLang] || translations['ko'] || translations['en'];

  const [tickerStats, setTickerStats] = useState<string[]>([
    "📢 실시간 글로벌 파이 뉴스룸 핫이슈 동기화 중입니다...",
    "📢 최신 생태계 핵심 소식 및 마이그레이션 모니터링 가동 중"
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "ko";
      setCurrentLang(savedLang);
    }

    const handleLangChange = () => {
      const savedLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "ko";
      setCurrentLang(savedLang);
    };

    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const handleLanguageSelect = (newLang: string) => {
    setCurrentLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang);
      localStorage.setItem("gpnr-language", newLang);
      window.dispatchEvent(new Event("languageChange"));
    }
  };

  useEffect(() => {
    const loadHotNewsForTicker = async () => {
      try {
        const response = await fetch(`/api/fetch-news?category=top-news&t=${Date.now()}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const allNews = await response.json();

        if (Array.isArray(allNews) && allNews.length > 0) {
          const cleanText = (text: string) => {
            if (!text) return "";
            return text
              .replace(/<\/?[^>]+(>|$)/g, "")
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&#39;/g, "'")
              .replace(/&nbsp;/g, ' ')
              .trim();
          };

          const sortedNews = [...allNews].sort((a, b) => {
            const dateARaw = a.publishedAt || a.date || "";
            const dateBRaw = b.publishedAt || b.date || "";

            const timeA = dateARaw ? new Date(dateARaw).getTime() : 0;
            const timeB = dateBRaw ? new Date(dateBRaw).getTime() : 0;

            return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
          });

          const hotHeadlines = sortedNews
            .slice(0, 5)
            .map((item: any, idx: number) => {
              const cleanedTitle = cleanText(item.title || item.snippet || "");
              return `🔥 [실시간 핫이슈 ${idx + 1}] ${cleanedTitle}`;
            })
            .filter((headline: string) => headline.length > 15);

          if (hotHeadlines.length > 0) {
            setTickerStats(hotHeadlines);
          }
        }
      } catch (error) {
        console.error("전광판 실시간 뉴스 연동 실패:", error);
      }
    };

    loadHotNewsForTicker();
    const interval = setInterval(loadHotNewsForTicker, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sXRef = useRef<number | null>(null);
  const eXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    sXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.targetTouches[0].clientX;
    eXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (sXRef.current === null || eXRef.current === null) return;
    const distance = sXRef.current - eXRef.current;
    const currentIndex = CATEGORIES.indexOf(activeCategory);

    if (currentIndex === -1) return;

    if (distance > 75 && currentIndex < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIndex + 1]);
    } else if (distance < -75 && currentIndex > 0) {
      setActiveCategory(CATEGORIES[currentIndex - 1]);
    }

    sXRef.current = null;
    eXRef.current = null;
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKycId.trim()) {
      setInputError("KYC 인증 ID 또는 지갑 주소를 입력해 주세요.");
      return;
    }

    const success = loginWithKycId(inputKycId);
    if (success) {
      setInputError("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center text-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-sm font-medium tracking-wide">{t.loading || "로딩 중..."}</p>
      </div>
    );
  }

  if (!isAuthenticated || !user || !user.username) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-[#1e293b] border border-purple-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-600/20 rounded-xl border border-purple-500/30">
              <span className="text-xl">🔐</span>
            </div>
            <div>
              <h2 className="text-
