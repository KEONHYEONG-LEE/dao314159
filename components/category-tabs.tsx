"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NEWS_CATEGORIES } from "@/lib/categories"; // [수정] lib/categories.ts에서 데이터 단일 출처 로드

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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const activeTab = scrollRef.current.querySelector(`[data-id="${selectedCategory}"]`) as HTMLElement;
      if (activeTab) {
        const container = scrollRef.current;
        const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
    handleScroll();
  }, [selectedCategory]);

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
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <div className="w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/[0.05] shadow-2xl">
      <div className="mx-auto max-w-7xl relative px-2">
        
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-14 z-10 flex items-center justify-start bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto ml-1 w-7 h-7 flex items-center justify-center bg-slate-800/90 border border-slate-700/50 rounded-full text-white shadow-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-1.5 py-3.5 px-1 overflow-x-auto no-scrollbar scroll-smooth notranslate"
        >
          {/* [수정] NEWS_CATEGORIES 원본 배열 활용 */}
          {NEWS_CATEGORIES.map((category) => (
            <button
              key={category.id}
              data-id={category.id}
              onClick={() => onCategoryChange(category.id)}
              translate="no"
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                  : "bg-slate-800/40 text-slate-400 border-white/[0.05] hover:border-slate-600"
              }`}
            >
              {/* [수정] currentLang에 따른 다국어 표시 및 필드명 동기화 */}
              {currentLang === "ko" ? category.name : category.enName}
            </button>
          ))}
        </div>

        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-14 z-10 flex items-center justify-end bg-gradient-to-l from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto mr-1 w-7 h-7 flex items-center justify-center bg-slate-800/90 border border-slate-700/50 rounded-full text-white shadow-xl"
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
