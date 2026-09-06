"use client"; 

import { useState, useEffect } from "react";
import { shareNews, stripHtml } from "@/lib/utils";

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

// 한국어 카테고리 매핑
const CATEGORY_MAP: Record<string, string> = {
  ALL: "주요뉴스", MAINNET: "메인넷", COMMUNITY: "커뮤니티", COMMERCE: "커머스",
  NODE: "노드", MINING: "채굴", WALLET: "지갑", BROWSER: "브라우저",
  KYC: "KYC", DEVELOPER: "개발자", ECOSYSTEM: "부동산", LISTING: "전망시세",
  OUTLOOK: "전망시세", PRICE: "가격", SECURITY: "보안", EVENT: "주요행사", ROADMAP: "로드맵",
  WHITEPAPER: "백서", LEGAL: "관련법규"
};

// 기본 영어 모드용 카테고리 매핑
const EN_CATEGORY_MAP: Record<string, string> = {
  ALL: "Top News", MAINNET: "Mainnet", COMMUNITY: "Community", COMMERCE: "Commerce",
  NODE: "Node", MINING: "Mining", WALLET: "Wallet", BROWSER: "Browser",
  KYC: "KYC", DEVELOPER: "Developers", ECOSYSTEM: "Real Estate", LISTING: "Price Outlook",
  OUTLOOK: "Price Outlook", PRICE: "Price", SECURITY: "Security", EVENT: "Events", ROADMAP: "Roadmap",
  WHITEPAPER: "Whitepaper", LEGAL: "Regulations"
};

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState("en"); // 기본 영어 모드 세팅

  useEffect(() => {
    const saved = localStorage.getItem('gpnr_status');
    if (saved) setStatus(JSON.parse(saved));

    // 현재 앱 언어 감지
    const targetLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "en";
    setCurrentLang(targetLang);

    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/fetch-news?category=${selectedCategory}`); 
        const allData = await response.json();
        setNews(allData || []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();

    // 언어 실시간 변경 감지 이벤트 바인딩
    const handleLangChange = () => {
      const updatedLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "en";
      setCurrentLang(updatedLang);
    };
    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);

    return () => {
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("languageChange", handleLangChange);
    };
  }, [selectedCategory]);

  // 상태 변경 저장 함수 (읽음, 별표, 하트)
  const updateStatus = (id: string, key: 'read' | 'star' | 'heart') => {
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
    localStorage.setItem('gpnr_status', JSON.stringify(newStatus));
  };

  // 뉴스 공유 핸들러 함수 (Pi.shareFile 및 fallback 연동)
  const handleShare = async (item: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation(); // 기사 클릭 이벤트 전파 방지
    
    const cleanContent = stripHtml(item.content || item.title);
    await shareNews({
      title: item.title,
      text: cleanContent.slice(0, 100) + '...', // 공유 내용 요약
      url: item.url
    });
  };

  return (
    <div className="w-full space-y-4">
      {loading ? (
        <div className="py-12 text-center text-gray-500">
          {currentLang === 'ko' ? "뉴스를 불러오는 중입니다..." : "Loading news..."}
        </div>
      ) : news.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          {currentLang === 'ko' ? "등록된 뉴스가 없습니다." : "No news available."}
        </div>
      ) : (
        news.map((item) => {
          const itemStatus = status[item.id] || { read: false, star: false, heart: false };
          const isExpanded = expandedId === item.id;
          const displayCategory = currentLang === 'ko' 
            ? (CATEGORY_MAP[item.category] || item.category)
            : (EN_CATEGORY_MAP[item.category] || item.category);

          const imgUrl = item.imageUrl || item.image || item.urlToImage;

          return (
            <div 
              key={item.id} 
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800 ${
                itemStatus.read ? "opacity-75 bg-gray-50 dark:bg-gray-900" : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => {
                updateStatus(item.id, 'read');
                setExpandedId(isExpanded ? null : item.id);
              }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                      {displayCategory}
                    </span>
                    <span className="text-xs text-gray-400">{item.source}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  
                  <h3 className={`font-semibold text-base leading-snug ${
                    itemStatus.read ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white"
                  }`}>
                    {item.title}
                  </h3>
                </div>

                {imgUrl && (
                  <img 
                    src={imgUrl} 
                    alt={item.title} 
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* 기사 확장 및 본문 표시 */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                  <p>{stripHtml(item.content || item.title)}</p>
                  <div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:underline text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentLang === 'ko' ? "원문 기사 읽기 →" : "Read Full Article →"}
                    </a>
                  </div>
                </div>
              )}

              {/* 하단 아이콘 (하트, 별표, 공유) */}
              <div className="mt-3 pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(item.id, 'heart');
                    }}
                    className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                      itemStatus.heart ? "text-red-500" : ""
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(item.id, 'star');
                    }}
                    className={`flex items-center gap-1 hover:text-yellow-500 transition-colors ${
                      itemStatus.star ? "text-yellow-500" : ""
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </button>
                </div>

                {/* 공유 버튼 */}
                <button 
                  onClick={(e) => handleShare(item, e)}
                  className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1"
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
