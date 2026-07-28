"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Monitor, TrendingUp, Wallet, Compass, Map, FileText, Users, ShoppingBag, Key, HelpCircle, Shield, Landmark } from "lucide-react";

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

  useEffect(() => {
    async function fetchRealNews() {
      setLoading(true);
      try {
        const response = await fetch(`/api/fetch-news?category=${selectedCategory}&t=${Date.now()}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setNewsList(data);
        }
      } catch (error) {
        console.error("뉴스 데이터 수집 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRealNews();
  }, [selectedCategory]);

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
                          
                          {/* 하단 정보 영역 */}
                          <div className="flex items-center justify-between gap-2 mt-3">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 whitespace-nowrap">
                              <span className="text-blue-500 font-bold">{sourceStr}</span>
                              <span>{dateStr}</span>
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
