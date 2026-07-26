"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// [수정] 기본 영어 모드 지원을 위해 enLabel 필드 추가
const categories = [
  { id: "all", label: "주요뉴스", enLabel: "Top News" },
  { id: "mainnet", label: "메인넷", enLabel: "Mainnet" },
  { id: "node", label: "노드", enLabel: "Node" },
  { id: "mining", label: "채굴", enLabel: "Mining" },
  { id: "wallet", label: "지갑", enLabel: "Wallet" },
  { id: "browser", label: "브라우저", enLabel: "Browser" },
  { id: "roadmap", label: "로드맵", enLabel: "Roadmap" },
  { id: "whitepaper", label: "백서", enLabel: "Whitepaper" },
  { id: "community", label: "커뮤니티", enLabel: "Community" },
  { id: "commerce", label: "커머스", enLabel: "Commerce" },
  { id: "kyc", label: "KYC", enLabel: "KYC" },
  { id: "developer", label: "개발자", enLabel: "Developers" },
  { id: "ecosystem", label: "부동산", enLabel: "Real Estate" },
  { id: "outlook", label: "전망시세", enLabel: "Price Outlook" },
  { id: "price", label: "가격", enLabel: "Price" },
  { id: "security", label: "보안", enLabel: "Security" },
  { id: "legal", label: "관련법규", enLabel: "Regulations" }
];

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  language?: string; // [추가] 부모 컴포넌트에서 언어 상태를 직접 넘겨받을 수 있도록 허용
}

export function CategoryTabs({ selectedCategory, onCategoryChange, language }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentLang, setCurrentLang] = useState(language || "en"); // 기본 영어 모드

  // [추가] Props로 language가 안 넘어올 경우를 대비해 localStorage 연동 안전장치 구성
  useEffect(() => {
    if (language) {
      setCurrentLang(language);
    } else {
      const savedLang = localStorage.getItem("language") || "en";
      setCurrentLang(savedLang);

      // 언어 변경 이벤트 감지
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
          {categories.map((category) => (
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
              {/* [수정] 영어 모드('en')일 때는 enLabel을, 한국어 모드일 때는 label을 출력 */}
              {currentLang === "en" ? category.enLabel : category.label}
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
