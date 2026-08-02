"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Flame, Globe, Tv, Zap, Wallet, Compass, Map, FileText, 
  Users, ShoppingCart, ShieldCheck, Code, Home, TrendingUp, 
  DollarSign, Shield, Gavel, Check, Star, Heart 
} from "lucide-react";
import { NEWS_CATEGORIES } from "@/lib/categories"; // [수정] 중앙 카테고리 정의 로드

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

// [수정] Lucide 아이콘 단일 매핑 (불꽃 아이콘 Flame 추가)
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
        const response = await fetch(`/api/fetch-news?category=${selectedCategory}&t=${Date.now()}`);
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
        }
      } catch (error) {
        console.error("뉴스 데이터 수집 실패:", error);
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

  // [수정] 뉴스를 허용된 공식 카테고리로만 안전하게 그룹화 ('투표/모두' 등 미인증 카테고리 배제)
  const groupedNews = newsList.reduce((acc, news) => {
    let rawCat = (news.category || "top-news").toLowerCase();
    if (rawCat === "all" || rawCat === "vote" || rawCat === "poll") {
      rawCat = "top-news"; // 잘못 유입된 id는 '주요뉴스'로 자동 통합
    }
    
    // 공식 정의 카테고리에 속하지 않으면 top-news로 매핑
    const exists = NEWS_CATEGORIES.some(c => c.id === rawCat);
    const catKey = exists ? rawCat : "top-news";

    if (!acc[catKey]) acc[catKey] = [];
    acc[catKey].push(news);
    return acc;
  }, {} as { [key: string]: NewsItem[] });

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
      <div className="grid grid-cols-1 gap-6">
        {Object.keys(groupedNews).length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            현재 카테고리에 뉴스가 없습니다.
          </div>
        ) : (
          Object.entries(groupedNews).map(([categoryId, articles]) => {
            // [수정] ID에 대응하는 공식 카테고리 메타 정보 조회 (이름, 아이콘 매핑)
            const matchedCategory = NEWS_CATEGORIES.find(c => c.id === categoryId);
            const categoryTitle = currentLang === "ko" 
              ? (matchedCategory?.name || "주요뉴스") 
              : (matchedCategory?.enName || "Top News");

            return (
              <div key={categoryId} className="flex flex-col">
                {/* [수정] 섹션 헤더: 불꽃 아이콘 + "주요뉴스" 정식 라벨 출력 */}
                <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2">
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[categoryId] || <Flame className="w-4 h-4 text-rose-500" />}
                    <h2 className="text-xs font-black text-slate-100 tracking-widest uppercase">
                      {categoryTitle}
                    </h2>
                  </div>
                </div>

                {/* 뉴스 리스트 */}
                <div className="flex flex-col">
                  {articles.map((article) => {
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
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
