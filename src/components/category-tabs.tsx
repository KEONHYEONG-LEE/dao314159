"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 외부 파일 불러오기 시도 (오류 방어)
import * as CategoriesModule from "@/lib/categories";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  language?: string;
}

// 기본 카테고리 빽업 (NEWS_CATEGORIES 로드 실패 대비)
const FALLBACK_CATEGORIES = [
  { id: "top-news", name: "주요뉴스", enName: "Top News" },
  { id: "mainnet", name: "메인넷", enName: "Mainnet" },
  { id: "node", name: "노드", enName: "Node" },
  { id: "mining", name: "채굴", enName: "Mining" },
  { id: "wallet", name: "지갑", enName: "Wallet" },
  { id: "browser", name: "브라우저", enName: "Browser" },
  { id: "roadmap", name: "로드맵", enName: "Roadmap" },
  { id: "whitepaper", name: "백서", enName: "Whitepaper" },
  { id: "community", name: "커뮤니티", enName: "Community" },
  { id: "commerce", name: "커머스", enName: "Commerce" },
  { id: "kyc", name: "KYC", enName: "KYC" },
  { id: "developer", name: "개발자", enName: "Developer" },
  { id: "ecosystem", name: "부동산", enName: "Real Estate" },
  { id: "outlook", name: "전망시세", enName: "Outlook" },
  { id: "price", name: "가격", enName: "Price" },
  { id: "security", name: "보안", enName: "Security" },
  { id: "legal", name: "관련법규", enName: "Legal" },
];

export function CategoryTabs({ selectedCategory, onCategoryChange, language }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentLang, setCurrentLang] = useState(language || "en");
  const [mounted, setMounted] = useState(false);

  // 안전하게 카테고리 목록 확보
  const categoriesList = Array.isArray((CategoriesModule as any)?.NEWS_CATEGORIES)
    ? (CategoriesModule as any).NEWS_CATEGORIES
    : FALLBACK_CATEGORIES;

  useEffect(() => {
    setMounted(true);
    if (language) {
      setCurrentLang(language);
    } else {
      try {
        const savedLang = localStorage.getItem("language") || localStorage.getItem("gpnr_lang") || "en";
        setCurrentLang(savedLang);

        const handleStorageChange = () => {
          const updatedLang = localStorage.getItem("language") || localStorage.getItem("gpnr_lang") || "en";
          setCurrentLang(updatedLang);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
      } catch (e) {
        console.error("Storage read error:", e);
      }
    }
  }, [language]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    if (scrollRef.current) {
      const targetId = selectedCategory === "all" || !selectedCategory ? "top-news" : selectedCategory;
      const activeTab = scrollRef.current.querySelector(`[data-id="${targetId}"]`) as HTMLElement;
      
      if (activeTab) {
        const container = scrollRef.current;
        const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
    handleScroll();
  }, [selectedCategory, mounted]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 240;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  return (
    <div className="w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/[0.05] shadow-2xl">
      <div className="mx-auto max-w-7xl relative px-2">
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-14 z-10 flex items-center justify-start bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("left")}
              type="button"
              className="pointer-events-auto ml-1 w-7 h-7 flex items-center justify-center bg-slate-800/90 border border-slate-700/50 rounded-full text-white shadow-xl hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-1.5 py-3.5 px-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
        >
          {categoriesList.map((category: any) => {
            const isSelected = 
              selectedCategory === category.id || 
              ((selectedCategory === "all" || !selectedCategory) && category.id === "top-news");

            return (
              <button
                key={category.id}
                data-id={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-300 border ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-105"
                    : "bg-slate-800/40 text-slate-400 border-white/[0.05] hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {currentLang === "ko" ? (category.name || category.label) : (category.enName || category.enLabel || category.name)}
              </button>
            );
          })}
        </div>

        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-14 z-10 flex items-center justify-end bg-gradient-to-l from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("right")}
              type="button"
              className="pointer-events-auto mr-1 w-7 h-7 flex items-center justify-center bg-slate-800/90 border border-slate-700/50 rounded-full text-white shadow-xl hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
