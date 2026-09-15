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

// 안전한 HTML 태그 제거 함수
function safeStripHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/<[^>]*>?/gm, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    try {
      const saved = localStorage.getItem('gpnr_status');
      if (saved) setStatus(JSON.parse(saved));

      const targetLang = localStorage.getItem("gpnr_lang") || localStorage.getItem("language") || "en";
      setCurrentLang(targetLang);
    } catch (e) {
      console.error("Storage read error:", e);
    }

    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/fetch-news?category=${selectedCategory}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const allData = await response.json();
        
        if (Array.isArray(allData)) {
          setNews(allData);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();

    const handleLangChange = () => {
      try {
        const updatedLang = localStorage.getItem("gpnr_lang") || localStorage.getItem("language") || "en";
        setCurrentLang(updatedLang);
      } catch (e) {
        console.error("Lang change error:", e);
      }
    };

    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);

    return () => {
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("languageChange", handleLangChange);
    };
  }, [selectedCategory]);

  const updateStatus = (id: string, key: 'read' | 'star' | 'heart') => {
    if (!id) return;
    const newStatus = {
      ...status,
      [id]: {
        read: status[id]?.read || false,
        star: status[id]?.star || false,
        heart: status[id]?.heart || false,
        [key]: !status[id]?.[key]
      }
    };
    setStatus(newStatus);
    try {
      localStorage.setItem('gpnr_status', JSON.stringify(newStatus));
    } catch (e) {
      console.error("Storage write error:", e);
    }
  };

  const handleShare = async (item: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanContent = safeStripHtml(item.content || item.title);
    const shareData = {
      title: item.title || "GPNR News",
      text: cleanContent.slice(0, 100) + '...',
      url: item.url || typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        alert(currentLang === 'ko' ? "링크가 클립보드에 복사되었습니다." : "Link copied to clipboard.");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  if (!mounted) {
    return <div className="py-12 text-center text-slate-500 text-xs">Loading feed...</div>;
  }

  return (
    <div className="w-full space-y-4">
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          {currentLang === 'ko' ? "뉴스를 불러오는 중입니다..." : "Loading news..."}
        </div>
      ) : !Array.isArray(news) || news.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          {currentLang === 'ko' ? "등록된 뉴스가 없습니다." : "No news available."}
        </div>
      ) : (
        news.map((item, index) => {
          const itemId = item.id || `news-item-${index}`;
          const itemStatus = status[itemId] || { read: false, star: false, heart: false };
          const isExpanded = expandedId === itemId;
          
          const rawCat = (item.category || "ALL").toUpperCase();
          const displayCategory = currentLang === 'ko'
            ? (CATEGORY_MAP[rawCat] || item.category || "뉴스")
            : (EN_CATEGORY_MAP[rawCat] || item.category || "News");

          const imgUrl = item.imageUrl || item.image || item.urlToImage;

          return (
            <div
              key={itemId}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer bg-slate-800/80 hover:bg-slate-800 ${
                itemStatus.read ? "opacity-75 border-slate-700/50" : "border-slate-700"
              }`}
              onClick={() => {
                updateStatus(itemId, 'read');
                setExpandedId(isExpanded ? null : itemId);
              }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/30">
                      {displayCategory}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.source || "GPNR"}</span>
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400">{item.date || ""}</span>
                  </div>

                  <h3 className={`font-semibold text-sm leading-snug ${
                    itemStatus.read ? "text-slate-400" : "text-slate-100"
                  }`}>
                    {item.title}
                  </h3>
                </div>

                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={item.title || "News Image"}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-slate-900"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs text-slate-300 leading-relaxed space-y-3">
                  <p>{safeStripHtml(item.content || item.title)}</p>
                  <div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-400 font-medium hover:underline text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {currentLang === 'ko' ? "원문 기사 읽기 →" : "Read Full Article →"}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(itemId, 'heart');
                    }}
                    className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${
                      itemStatus.heart ? "text-rose-500" : ""
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(itemId, 'star');
                    }}
                    className={`flex items-center gap-1 hover:text-amber-400 transition-colors ${ 
                      itemStatus.star ? "text-amber-400" : "" 
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </button>
                </div>

                <button
                  onClick={(e) => handleShare(item, e)}
                  className="flex items-center gap-1 hover:text-purple-400 transition-colors p-1"
                  title={currentLang === 'ko' ? "공유하기" : "Share"}
                >
                  <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
