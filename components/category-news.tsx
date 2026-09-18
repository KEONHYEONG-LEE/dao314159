// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { NEWS_CATEGORIES } from "../lib/categories";

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
    if (typeof rawDate === "string" && rawDate.includes("년")) {
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
    return String(rawDate).split("T")[0].split(" ")[0];
  };

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedChecked = localStorage.getItem("gpnr_news_checked");
        const savedStarred = localStorage.getItem("gpnr_news_starred");
        const savedLiked = localStorage.getItem("gpnr_news_liked");

        if (savedChecked) setCheckedIds(JSON.parse(savedChecked));
        if (savedStarred) setStarredIds(JSON.parse(savedStarred));
        if (savedLiked) setLikedIds(JSON.parse(savedLiked));
      }
    } catch (error) {
      console.error("저장된 반응 상태 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    async function fetchRealNews() {
      setLoading(true);
      try {
        const targetCategory = selectedCategory === "all" || !selectedCategory ? "top-news" : selectedCategory;
        const response = await fetch(`/api/fetch-news?category=${targetCategory}&t=${Date.now()}`);
        if (!response.ok) throw new Error("Fetch failed");
        
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
      try { localStorage.setItem("gpnr_news_checked", JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
  };

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setStarredIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem("gpnr_news_starred", JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem("gpnr_news_liked", JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
  };

  const getParsedText = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[currentLang] || field.en || field.ko || "";
  };

  const activeCategoryId = (selectedCategory === "all" || !selectedCategory) ? "top-news" : selectedCategory;
  const matchedCategory = Array.isArray(NEWS_CATEGORIES) ? NEWS_CATEGORIES.find(c => c.id === activeCategoryId) : null;
  
  const categoryTitle = currentLang === "ko" 
    ? (matchedCategory?.name || matchedCategory?.label || "주요뉴스") 
    : (matchedCategory?.enName || matchedCategory?.enLabel || "Top News");

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
        <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🔥</span>
            <h2 className="text-xs font-black text-slate-100 tracking-widest uppercase">
              {categoryTitle}
            </h2>
          </div>
        </div>

        {newsList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            현재 카테고리에 뉴스가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col">
            {newsList.map((article) => {
              const articleId = article.id || Math.random().toString();
              const titleStr = getParsedText(article.title);
              const sourceStr = article.author || article.source || "GPNR News";
              const rawDateStr = article.publishedAt || article.date || "";
              const dateStr = formatDateOnly(rawDateStr);
              const imageSrc = article.imageUrl || article.image || "https://picsum.photos/id/10/200/200";
              const targetUrl = article.sourceUrl || article.url || "#";

              const isChecked = !!checkedIds[articleId];
              const isStarred = !!starredIds[articleId];
              const isLiked = !!likedIds[articleId];

              return (
                <a
                  key={articleId}
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
                            onClick={(e) => toggleCheck(e, articleId)}
                            title="체크 표시"
                            className="p-0.5 transition-transform active:scale-125"
                          >
                            {isChecked ? (
                              <span className="text-amber-500 font-bold text-xs">✓</span>
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-600 hover:border-slate-400" />
                            )}
                          </button>

                          <button
                            onClick={(e) => toggleStar(e, articleId)}
                            title="즐겨찾기"
                            className="p-0.5 transition-transform active:scale-125"
                          >
                            <span className={isStarred ? "text-yellow-400 text-xs" : "text-slate-600 text-xs"}>★</span>
                          </button>

                          <button
                            onClick={(e) => toggleLike(e, articleId)}
                            title="좋아요"
                            className="p-0.5 transition-transform active:scale-125"
                          >
                            <span className={isLiked ? "text-rose-500 text-xs" : "text-slate-600 text-xs"}>♥</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
                      <img
                        src={imageSrc}
                        alt={titleStr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://picsum.photos/id/10/200/200";
                        }}
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
