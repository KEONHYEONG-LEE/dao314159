"use client";

import { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  imageUrl?: string;
  image?: string;
  urlToImage?: string;
  url: string;
  source: string;
  date: string;
  content?: string;
  summary?: string;
  views?: number;
}

const CATEGORY_MAP: Record<string, string> = {
  ALL: "주요뉴스", MAINNET: "메인넷", COMMUNITY: "커뮤니티", COMMERCE: "커머스",
  NODE: "노드", MINING: "채굴", WALLET: "지갑", BROWSER: "브라우저",
  KYC: "KYC", DEVELOPER: "개발자", ECOSYSTEM: "부동산", LISTING: "전망시세",
  OUTLOOK: "전망시세", PRICE: "가격", SECURITY: "보안", EVENT: "주요행사", ROADMAP: "로드맵",
  WHITEPAPER: "백서", LEGAL: "관련법규"
};

const EN_CATEGORY_MAP: Record<string, string> = {
  ALL: "Top News", MAINNET: "Mainnet", COMMUNITY: "Community", COMMERCE: "Commerce",
  NODE: "Node", MINING: "Mining", WALLET: "Wallet", BROWSER: "Browser",
  KYC: "KYC", DEVELOPER: "Developers", ECOSYSTEM: "Real Estate", LISTING: "Price Outlook",
  OUTLOOK: "Price Outlook", PRICE: "Price", SECURITY: "Security", EVENT: "Events", ROADMAP: "Roadmap",
  WHITEPAPER: "Whitepaper", LEGAL: "Regulations"
};

export function CategoryNews({ selectedCategory, currentLang = "en" }: { selectedCategory: string; currentLang?: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean; views: number }>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("gpnr_status");
        if (saved) setStatus(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    let isSubscribed = true;

    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/fetch-news?category=${encodeURIComponent(selectedCategory || "top-news")}`);
        if (!response.ok) throw new Error("Fetch failed");
        const allData = await response.json();
        if (isSubscribed) {
          setNews(Array.isArray(allData) ? allData : []);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        if (isSubscribed) setNews([]);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    fetchLatestNews();
    return () => {
      isSubscribed = false;
    };
  }, [selectedCategory, isMounted]);

  const stripHtml = (html?: string) => {
    if (!html) return "";
    return String(html).replace(/<\/?[^>]+(>|$)/g, "").trim();
  };

  const updateStatus = (id: string, key: "read" | "star" | "heart" | "views") => {
    const current = status[id] || { read: false, star: false, heart: false, views: 0 };
    const newStatus = {
      ...status,
      [id]: {
        ...current,
        read: key === "read" ? true : current.read,
        star: key === "star" ? !current.star : current.star,
        heart: key === "heart" ? !current.heart : current.heart,
        views: key === "views" ? (current.views || 0) + 1 : current.views
      }
    };
    setStatus(newStatus);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gpnr_status", JSON.stringify(newStatus));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleNewsClick = (id: string) => {
    updateStatus(id, "read");
    updateStatus(id, "views");
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleShare = async (item: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(item.url || "");
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error("복사 실패", err);
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full py-12 text-center text-slate-400 text-sm">
        {currentLang === "ko" ? "로딩 중..." : "Loading..."}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          {currentLang === "ko" ? "뉴스를 불러오는 중입니다..." : "Loading news..."}
        </div>
      ) : news.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          {currentLang === "ko" ? "등록된 뉴스가 없습니다." : "No news available."}
        </div>
      ) : (
        news.map((item) => {
          if (!item || !item.id) return null;
          const itemStatus = status[item.id] || { read: false, star: false, heart: false, views: 0 };
          const isExpanded = expandedId === item.id;
          const displayCategory = currentLang === "ko"
            ? (CATEGORY_MAP[item.category] || item.category || "뉴스")
            : (EN_CATEGORY_MAP[item.category] || item.category || "News");

          const imgUrl = item.imageUrl || item.image || item.urlToImage;
          const viewCount = (item.views || 0) + (itemStatus.views || 0);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer bg-[#1e293b] border-slate-700/80 hover:border-purple-500/50 ${
                itemStatus.read ? "opacity-85" : ""
              }`}
              onClick={() => handleNewsClick(item.id)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/30">
                      {displayCategory}
                    </span>
                    <span className="text-xs text-slate-400">{item.source || "GPNR"}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{item.date || ""}</span>
                  </div>

                  <h3 className={`font-semibold text-base leading-snug ${
                    itemStatus.read ? "text-slate-300" : "text-white"
                  }`}>
                    {item.title}
                  </h3>
                </div>

                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={item.title || "news"}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-slate-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-700/80 text-sm text-slate-300 leading-relaxed space-y-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <p className="font-semibold text-purple-400 text-xs">📌 AI 핵심 요약본</p>
                  <p className="text-xs text-slate-200">{stripHtml(item.summary || item.content || item.title)}</p>
                  <div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold text-xs underline mt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentLang === "ko" ? "원문 기사 보러가기 →" : "Read Full Article →"}
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(item.id, "heart");
                    }}
                    className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${
                      itemStatus.heart ? "text-rose-500 font-bold" : ""
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>{itemStatus.heart ? 1 : 0}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(item.id, "star");
                    }}
                    className={`flex items-center gap-1 hover:text-amber-400 transition-colors ${
                      itemStatus.star ? "text-amber-400 font-bold" : ""
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </button>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    👁️ {viewCount}
                  </span>
                </div>

                <button
                  onClick={(e) => handleShare(item, e)}
                  className="flex items-center gap-1 hover:text-purple-300 transition-colors p-1"
                >
                  {copiedId === item.id ? (
                    <span className="text-emerald-400 text-[11px] font-bold">복사완료!</span>
                  ) : (
                    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
export default CategoryNews;
