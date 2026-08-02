"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Flame, Globe, Tv, Zap, Wallet, Compass, Map, FileText, 
  Users, ShoppingCart, ShieldCheck, Code, Home, TrendingUp, 
  DollarSign, Shield, Gavel, Check, Star, Heart 
} from "lucide-react";
import { NEWS_CATEGORIES } from "@/lib/categories";

interface NewsItem {
  id: string;
  category: string;
  title: { ko: string; en: string } | string;
  content?: { ko: string; en: string } | string;
  author?: string;
  source?: string;
  sourceUrl?: string;
  url?: string;
  publishedAt?: string;
  date?: string;
  imageUrl?: string;
  image?: string;
}

// Lucide 아이콘 매핑
const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
  "top-news": <Flame className="w-4 h-4 text-rose-500" />,
  mainnet: <Globe className="w-4 h-4 text-blue-500" />,
  node: <Tv className="w-4 h-4 text-indigo-400" />,
  mining: <Zap className="w-4 h-4 text-yellow-500" />,
  wallet: <Wallet className="w-4 h-4 text-purple-500" />,
  browser: <Compass className="w-4 h-4 text-cyan-500" />,
  roadmap: <Map className="w-4 h-4 text-orange-500" />,
  whitepaper: <FileText className="w-4 h-4 text-gray-400" />,
  community: <Users className="w-4 h-4 text-teal-400" />,
  commerce: <ShoppingCart className="w-4 h-4 text-pink-500" />,
  kyc: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
  developer: <Code className="w-4 h-4 text-blue-400" />,
  realestate: <Home className="w-4 h-4 text-lime-500" />,
  outlook: <TrendingUp className="w-4 h-4 text-violet-500" />,
  price: <DollarSign className="w-4 h-4 text-amber-500" />,
  security: <Shield className="w-4 h-4 text-red-500" />,
  legal: <Gavel className="w-4 h-4 text-slate-400" />
};

export function CategoryNews({ 
  selectedCategory = "top-news", 
  currentLang = "ko" 
}: { 
  selectedCategory?: string; 
  currentLang?: string;
}) {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 반응 상태 관리
  const [checkedIds, setCheckedIds] = useState<{ [id: string]: boolean }>({});
  const [starredIds, setStarredIds] = useState<{ [id: string]: boolean }>({});
  const [likedIds, setLikedIds] = useState<{ [id: string]: boolean }>({});

  const formatDateOnly = (rawDate: string) => {
    if (!rawDate) return "";
    if (rawDate.includes("년")) {
      const match = rawDate.match(/\d{4}년\s*\d{1,2}월\s*\d{1,2}일/);
      if (match) return match[0];
    }
    const dateObj = new Date(rawDate);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      return `${year}년 ${month}월 ${day}일`;
    }
    return rawDate.split("T")[0].split(" ")[0];
  };

  useEffect(() => {
    try {
      const savedChecked = localStorage.getItem("gpnr_news_checked");
      const savedStarred = localStorage.getItem("gpnr_news_starred");
      const savedLiked = localStorage.getItem("gpnr_news_liked");

      if (savedChecked) setCheckedIds(JSON.parse(savedChecked));
      if (savedStarred) setStarredIds(JSON.parse(savedStarred));
      if (savedLiked) setLikedIds(JSON.parse(savedLiked));
    } catch (error) {
      console.error("저장된 반응 상태 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    async function fetchRealNews() {
      setLoading(true);
      try {
        const targetCategory = selectedCategory === "all" ? "top-news" : selectedCategory;
        const response = await fetch(`/api/fetch-news?category=${targetCategory}&t=${Date.now()}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            const dateARaw = a.publishedAt || a.date || "";
            const dateBRaw = b.publishedAt || b.date || "";

            const timeA = dateARaw ? new Date(dateARaw).getTime() : 0;
            const timeB = dateBRaw ? new Date(dateBRaw).getTime() : 0;

            const validA = isNaN(timeA) ? 0 : timeA;
            const validB = isNaN(timeB) ? 0 : timeB;

            return validB - validA;
          });

          setNewsList(sorted);
        } else {
          setNewsList([]);
        }
      } catch (error) {
        console.error("뉴스 데이터 수집 실패:", error);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRealNews();
  }, [selectedCategory]);

  const toggleCheck = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setCheckedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("gpnr_news_checked", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setStarredIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("gpnr_news_starred", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("gpnr_news_liked", JSON.stringify(updated));
      return updated;
    });
  };

  const getParsedText = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[currentLang] || field.en || field.ko || "";
  };

  // 현재 사용자가 선택한 카테고리 ID 및 메타 정보 추출
  const activeCategoryId = (selectedCategory === "all" || !selectedCategory) ? "top-news" : selectedCategory;
  const matchedCategory = NEWS_CATEGORIES.find(c => c.id === activeCategoryId);
  
  // 선택된 카테고리의 언어별 타이틀 (한국어/영어 대응)
  const categoryTitle = currentLang === "ko" 
    ? (matchedCategory?.name || "주요뉴스") 
    : (matchedCategory?.enName || "Top News");

  if (loading) {
    return (
      <section className="py-8 px-1 bg-[#0f172a] text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
        <p className="text-xs text-slate-400 font-medium">최신 실시간 Web2/Web3 뉴스를 불러오는 중입니다...</p>
      </section>
    );
  }

  return (
    <section className="py-2 px-1 bg-[#0f172a]">
      <div className="flex flex-col">
        {/* 선택한 카테고리 타이틀 및 아이콘 (Mainnet 선택 시 Mainnet, Top News 선택 시 Top News로 정확히 일치) */}
        <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2">
          <div className="flex items-center gap-2">
            {CATEGORY_ICONS[activeCategoryId] || <Flame className="w-4 h-4 text-rose-500" />}
            <h2 className="text-xs font-black text-slate-100 tracking-widest uppercase">
              {categoryTitle}
            </h2>
          </div>
        </div>

        {/* 뉴스 리스트 */}
        {newsList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            현재 카테고리에 뉴스가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col">
            {newsList.map((article) => {
              const titleStr = getParsedText(article.title);
              const sourceStr = article.author || article.source || "GPNR News";
              const rawDateStr = article.publishedAt || article.date || "";
              const dateStr = formatDateOnly(rawDateStr);
              const imageSrc = article.imageUrl || article.image || "https://picsum.photos/id/10/200/200";
              const targetUrl = article.sourceUrl || article.url || "#";

              const isChecked = !!checkedIds[article.id];
              const isStarred = !!starredIds[article.id];
              const isLiked = !!likedIds[article.id];

              return (
                <a
                  key={article.id}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border-b border-white/[0.05] last:border-0"
                >
                  <article className="flex gap-4 py-4 items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                        {titleStr}
                      </h3>
                      
                      <div className="flex items-center justify-between gap-2 mt-3">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 whitespace-nowrap">
                          <span className="text-blue-500 font-bold">{sourceStr}</span>
                          <span>•</span>
                          <span>{dateStr}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => toggleCheck(e, article.id)}
                            title="체크 표시"
                            className="p-0.5 transition-transform active:scale-125"
                          >
                            {isChecked ? (
                              <Check className="w-4 h-4 text-amber-700 stroke-[3]" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-600 hover:border-slate-400" />
                            )}
                          </button>

                          <button
                            onClick={(e) => toggleStar(e, article.id)}
                            title="즐겨찾기"
                            className="p-0.5 transition-transform active:scale-125"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isStarred
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-slate-600 hover:text-slate-400"
                              }`}
                            />
                          </button>

                          <button
                            onClick={(e) => toggleLike(e, article.id)}
                            title="좋아요"
                            className="p-0.5 transition-transform active:scale-125"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isLiked
                                  ? "text-rose-500 fill-rose-500"
                                  : "text-slate-600 hover:text-slate-400"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
                      <img
                        src={imageSrc}
                        alt={titleStr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </article>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
