"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NEWS_CATEGORIES } from "@/lib/categories";

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

  // 외부 language prop 또는 localStorage 다국어 상태 감지
  useEffect(() => {
    if (language) {
      setCurrentLang(language);
    } else {
      const savedLang = localStorage.getItem("language") || "en";
      setCurrentLang(savedLang);

      const handleStorageChange = () => {
        const updatedLang = localStorage.getItem("language") || "en";
        setCurrentLang(updatedLang);
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [language]);

  // 스크롤 위치 감지하여 좌우 화살표 노출 여부 제어
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // 활성화된 탭으로 스무스 스크롤 이동
  useEffect(() => {
    if (scrollRef.current) {
      // 'all' 카테고리가 들어오면 기본값인 'top-news' 탭으로 맞춤
      const targetId = selectedCategory === "all" ? "top-news" : selectedCategory;
      const activeTab = scrollRef.current.querySelector(`[data-id="${targetId}"]`) as HTMLElement;
      
      if (activeTab) {
        const container = scrollRef.current;
        const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
    handleScroll();
  }, [selectedCategory]);

  // 좌우 화살표 클릭 시 스크롤
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

        {/* 카테고리 탭 리스트 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-1.5 py-3.5 px-1 overflow-x-auto no-scrollbar scroll-smooth notranslate"
        >
          {NEWS_CATEGORIES.map((category) => {
            // selectedCategory가 'all'이거나 빈값일 경우 'top-news'를 active 처리
            const isSelected = 
              selectedCategory === category.id || 
              ((selectedCategory === "all" || !selectedCategory) && category.id === "top-news");

            return (
              <button
                key={category.id}
                data-id={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                translate="no"
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-300 border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)] scale-105"
                    : "bg-slate-800/40 text-slate-400 border-white/[0.05] hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {currentLang === "ko" ? category.name : category.enName}
              </button>
            );
          })}
        </div>

        {/* 오른쪽 화살표 */}
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

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
