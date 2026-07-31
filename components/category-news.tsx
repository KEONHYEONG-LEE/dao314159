"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Zap, Monitor, TrendingUp, Wallet, Compass, Map, FileText, 
  Users, ShoppingBag, Key, HelpCircle, Shield, Landmark,
  Check, Star, Heart
} from "lucide-react";

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

// 카테고리별 아이콘 매핑
const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
  MAINNET: <Zap className="w-4 h-4 text-yellow-500" />,
  NODE: <Monitor className="w-4 h-4 text-blue-500" />,
  MINING: <TrendingUp className="w-4 h-4 text-emerald-500" />,
  WALLET: <Wallet className="w-4 h-4 text-purple-500" />,
  BROWSER: <Compass className="w-4 h-4 text-cyan-500" />,
  ROADMAP: <Map className="w-4 h-4 text-orange-500" />,
  WHITEPAPER: <FileText className="w-4 h-4 text-gray-400" />,
  COMMUNITY: <Users className="w-4 h-4 text-indigo-400" />,
  COMMERCE: <ShoppingBag className="w-4 h-4 text-pink-500" />,
  KYC: <Key className="w-4 h-4 text-teal-500" />,
  DEVELOPER: <FileText className="w-4 h-4 text-blue-400" />,
  ECOSYSTEM: <HelpCircle className="w-4 h-4 text-lime-500" />,
  OUTLOOK: <TrendingUp className="w-4 h-4 text-violet-500" />,
  PRICE: <Landmark className="w-4 h-4 text-amber-600" />,
  SECURITY: <Shield className="w-4 h-4 text-red-500" />,
  LEGAL: <Landmark className="w-4 h-4 text-slate-400" />
};

export function CategoryNews({ 
  selectedCategory = "all", 
  currentLang = "en" 
}: { 
  selectedCategory?: string; 
  currentLang?: string;
}) {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 체크(읽음/확인), 별(북마크), 하트(좋아요) 상태 관리
  const [checkedIds, setCheckedIds] = useState<{ [id: string]: boolean }>({});
  const [starredIds, setStarredIds] = useState<{ [id: string]: boolean }>({});
  const [likedIds, setLikedIds] = useState<{ [id: string]: boolean }>({});

  // localStorage에서 이전에 저장된 반응 상태 로드
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
          // 💡 핵심 수정: 불러온 기사들을 publishedAt / date 기준으로 최신순(내림차순) 정렬
          const sorted = [...data].sort((a, b) => {
            const dateARaw = a.publishedAt || a.date || "";
            const dateBRaw = b.publishedAt || b.date || "";

            const timeA = dateARaw ? new Date(dateARaw).getTime() : 0;
            const timeB = dateBRaw ? new Date(dateBRaw).getTime() : 0;

            // 유효하지 않은 날짜 처리
            const validA = isNaN(timeA) ? 0 : timeA;
            const validB = isNaN(timeB) ? 0 : timeB;

            return validB - validA; // 최신 날짜가 위에 오도록 설정
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

  // 토글 액션 핸들러 (링크 이동 방지 적용)
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

  // 다국어 텍스트 파싱 지원 함수
  const getParsedText = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[currentLang] || field.en || field.ko || "";
  };

  // 수집된 뉴스를 카테고리별로 그룹화
  const groupedNews = newsList.reduce((acc, news) => {
    const catKey = (news.category || "MAINNET").toUpperCase();
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
          Object.entries(groupedNews).map(([categoryName, articles]) => (
            <div key={categoryName} className="flex flex-col">
              {/* 섹션 헤더 */}
              <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2">
                <div className="flex items-center gap-2">
                  {CATEGORY_ICONS[categoryName] || <Zap className="w-4 h-4 text-blue-400" />}
                  <h2 className="text-xs font-black text-slate-100 tracking-widest uppercase">
                    {categoryName}
                  </h2>
                </div>
              </div>

              {/* 뉴스 리스트 */}
              <div className="flex flex-col">
                {articles.map((article) => {
                  const titleStr = getParsedText(article.title);
                  const sourceStr = article.author || article.source || "GPNR News";
                  const dateStr = article.publishedAt || article.date || "";
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
                        {/* 텍스트 영역 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                            {titleStr}
                          </h3>
                          
                          {/* 하단 정보 및 반응 버튼 영역 */}
                          <div className="flex items-center justify-between gap-2 mt-3">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 whitespace-nowrap">
                              <span className="text-blue-500 font-bold">{sourceStr}</span>
                              <span>•</span>
                              <span>{dateStr}</span>
                            </div>

                            {/* 체크, 별, 하트 버튼 세트 */}
                            <div className="flex items-center gap-3">
                              {/* 1. 체크 (읽음/확인) */}
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

                              {/* 2. 별 (즐겨찾기) */}
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

                              {/* 3. 하트 (좋아요) */}
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

                        {/* 이미지 영역 */}
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
          ))
        )}
      </div>
    </section>
  );
}
