// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect } from "react";
import { NEWS_CATEGORIES } from "../lib/categories";

// Lucide 아이콘 패키지 임포트
import {
  Flame,
  Globe,
  Tv,
  Zap,
  Wallet,
  Compass,
  Map,
  FileText,
  Users,
  ShoppingCart,
  ShieldCheck,
  Code,
  Building,
  TrendingUp,
  DollarSign,
  Shield,
  Scale,
  Calendar,
  LayoutGrid
} from "lucide-react";

// category.id 기준 완벽 아이콘 매핑 객체 (모달 화면 ID 호환 추가)
export const ICON_MAP: Record<string, React.ElementType> = {
  "top-news": Flame,
  "mainnet": Globe,
  "node": Tv,
  "mining": Zap,
  "wallet": Wallet,
  "browser": Compass,
  "roadmap": Map,
  "whitepaper": FileText,
  "community": Users,
  "commerce": ShoppingCart,
  "kyc": ShieldCheck,
  "developer": Code,
  "developers": Code,             // 모달 복수형 ID 대응
  "ecosystem": Building,
  "real-estate": Building,        // 모달 Real Estate 대응
  "outlook": TrendingUp,
  "price-outlook": TrendingUp,    // 모달 Price Outlook 대응
  "price": DollarSign,
  "security": Shield,
  "legal": Scale,
  "regulations": Scale,          // 모달 Regulations 대응
  "calendar": Calendar,           // 모달 Calendar 대응
};

// 타 컴포넌트(모달 등)에서 바로 불러와 쓸 수 있는 아이콘 컴포넌트
export function CategoryIcon({ id, className = "w-4 h-4" }: { id: string; className?: string }) {
  const IconComponent = ICON_MAP[id] || LayoutGrid;
  return <IconComponent className={className} />;
}

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  language?: string;
}

export function CategoryTabs({ selectedCategory, onCategoryChange, language }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentLang, setCurrentLang] = useState(language || "en");

  // 언어 변경 감지
  useEffect(() => {
    if (language) {
      setCurrentLang(language);
    } else {
      try {
        const savedLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "en";
        setCurrentLang(savedLang);
      } catch (e) {}

      const handleStorageChange = () => {
        try {
          const updatedLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "en";
          setCurrentLang(updatedLang);
        } catch (e) {}
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [language]);

  // 스크롤 위치 감지
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // 활성화된 탭으로 스크롤 이동
  useEffect(() => {
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
  }, [selectedCategory]);

  // 좌우 스크롤 이동
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
        
        {/* 왼쪽 화살표 */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 flex items-center justify-start bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("left")}
              type="button"
              className="pointer-events-auto ml-1 w-7 h-7 flex items-center justify-center bg-slate-800 border border-slate-700/60 rounded-full text-white shadow-xl hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* 카테고리 탭 리스트 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-1.5 py-3 px-1 overflow-x-auto scroll-smooth notranslate [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {Array.isArray(NEWS_CATEGORIES) && NEWS_CATEGORIES.map((category) => {
            const isSelected = 
              selectedCategory === category.id || 
              ((selectedCategory === "all" || !selectedCategory) && category.id === "top-news");

            const labelText = currentLang === "ko" 
              ? (category.name || category.label || category.id) 
              : (category.enName || category.enLabel || category.id);

            // 매핑 객체에서 아이콘 컴포넌트 조회 (없으면 기본 아이콘)
            const IconComponent = ICON_MAP[category.id] || LayoutGrid;

            return (
              <button
                key={category.id}
                data-id={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)] scale-105"
                    : "bg-slate-800/40 text-slate-400 border-white/[0.05] hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{labelText}</span>
              </button>
            );
          })}
        </div>

        {/* 오른쪽 화살표 */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 flex items-center justify-end bg-gradient-to-l from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("right")}
              type="button"
              className="pointer-events-auto mr-1 w-7 h-7 flex items-center justify-center bg-slate-800 border border-slate-700/60 rounded-full text-white shadow-xl hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
