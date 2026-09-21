"use client"; 

import { useState, useEffect, useRef } from "react";
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

// 팝업 메뉴 다국어 딕셔너리
const MENU_TEXTS = {
  ko: {
    open_new_tab: "새 탭에서 열기",
    open_group_tab: "탭 그룹에서 열기",
    open_bg_tab: "백그라운드 탭에서 열기",
    open_new_window: "다른 창에서 열기",
    open_incognito: "비밀 모드에서 열기",
    select_text: "텍스트 선택",
    share_link: "링크 공유",
    copy_link: "링크 복사",
    save_link: "링크 저장",
    text_copied: "기사 텍스트가 복사되었습니다.",
    link_copied: "링크가 클립보드에 복사되었습니다.",
    link_saved: "기사가 즐겨찾기에 저장되었습니다.",
  },
  en: {
    open_new_tab: "Open in new tab",
    open_group_tab: "Open in tab group",
    open_bg_tab: "Open in background tab",
    open_new_window: "Open in new window",
    open_incognito: "Open in incognito tab",
    select_text: "Select text",
    share_link: "Share link",
    copy_link: "Copy link",
    save_link: "Save link",
    text_copied: "Article text copied to clipboard.",
    link_copied: "Link copied to clipboard.",
    link_saved: "Article saved.",
  },
};

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

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<"ko" | "en">("en");

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    item: NewsItem | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  // 현재 언어 가져오기 함수 (모든 키 체크)
  const getAppLanguage = (): "ko" | "en" => {
    if (typeof window === "undefined") return "en";
    const lang = 
      localStorage.getItem("language") || 
      localStorage.getItem("gpnr-language") || 
      localStorage.getItem("gpnr_lang") || 
      localStorage.getItem("pi_lang") || 
      "en";
    return lang.startsWith("ko") ? "ko" : "en";
  };

  const t = MENU_TEXTS[currentLang] || MENU_TEXTS.en;

  useEffect(() => {
    const saved = localStorage.getItem('gpnr_status');
    if (saved) setStatus(JSON.parse(saved));

    // 언어 상태 동기화
    setCurrentLang(getAppLanguage());

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

    // 언어 변경 및 로컬 스토리지 실시간 감지
    const handleLangChange = () => {
      setCurrentLang(getAppLanguage());
    };

    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);
    // DOM 변화 감지로 언어 스위치 반응 보완
    const interval = setInterval(() => {
      const detected = getAppLanguage();
      setCurrentLang((prev) => (prev !== detected ? detected : prev));
    }, 500);

    const handleOutsideClick = () => closeContextMenu();
    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", handleOutsideClick);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("languageChange", handleLangChange);
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("scroll", handleOutsideClick);
    };
  }, [selectedCategory]);

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const openContextMenu = (item: NewsItem, clientX: number, clientY: number) => {
    const menuWidth = 260;
    const menuHeight = 380;
    const x = Math.min(clientX, window.innerWidth - menuWidth - 16);
    const y = Math.min(clientY, window.innerHeight - menuHeight - 16);

    setContextMenu({
      visible: true,
      x: Math.max(16, x),
      y: Math.max(16, y),
      item,
    });
  };

  const handleTouchStart = (item: NewsItem, e: React.TouchEvent) => {
    isLongPress.current = false;
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      openContextMenu(item, clientX, clientY);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleContextMenu = (item: NewsItem, e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(item, e.clientX, e.clientY);
  };

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

  const handleShare = async (item: NewsItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanContent = stripHtml(item.content || item.title);
    await shareNews({
      title: item.title,
      text: cleanContent.slice(0, 100) + '...',
      url: item.url
    });
  };

  const handleMenuAction = (action: string) => {
    if (!contextMenu.item) return;
    const { url, title, content } = contextMenu.item;

    switch (action) {
      case "open_new_tab":
      case "open_group_tab":
      case "open_bg_tab":
      case "open_new_window":
      case "open_incognito":
        window.open(url, "_blank");
        break;
      case "select_text":
        navigator.clipboard.writeText(`${title}\n${stripHtml(content || "")}`);
        alert(t.text_copied);
        break;
      case "share_link":
        handleShare(contextMenu.item);
        break;
      case "copy_link":
        navigator.clipboard.writeText(url);
        alert(t.link_copied);
        break;
      case "save_link":
        updateStatus(contextMenu.item.id, 'star');
        alert(t.link_saved);
        break;
      default:
        break;
    }
    closeContextMenu();
  };

  return (
    <div className="w-full space-y-4 relative">
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
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none bg-white dark:bg-gray-800 ${
                itemStatus.read ? "opacity-75 bg-gray-50 dark:bg-gray-900" : "border-gray-200 dark:border-gray-700"
              }`}
              onTouchStart={(e) => handleTouchStart(item, e)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchEnd}
              onContextMenu={(e) => handleContextMenu(item, e)}
              onClick={() => {
                if (isLongPress.current) {
                  isLongPress.current = false;
                  return;
                }
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

      {/* 다국어 자동 반영 팝업 메뉴 */}
      {contextMenu.visible && contextMenu.item && (
        <div 
          className="fixed z-50 w-64 bg-gray-900/95 text-gray-200 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 py-2.5 text-sm overflow-hidden transition-all duration-150 animate-in fade-in zoom-in-95"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 border-b border-gray-700/60 text-xs text-gray-400 truncate">
            {contextMenu.item.url}
          </div>

          <div className="py-1">
            <button onClick={() => handleMenuAction("open_new_tab")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              {t.open_new_tab}
            </button>
            <button onClick={() => handleMenuAction("open_group_tab")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              {t.open_group_tab}
            </button>
            <button onClick={() => handleMenuAction("open_bg_tab")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              {t.open_bg_tab}
            </button>
            <button onClick={() => handleMenuAction("open_new_window")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              {t.open_new_window}
            </button>
            <button onClick={() => handleMenuAction("open_incognito")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors border-b border-gray-700/60 pb-2.5 mb-1">
              {t.open_incognito}
            </button>

            <button onClick={() => handleMenuAction("select_text")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors border-b border-gray-700/60 pb-2.5 mb-1">
              {t.select_text}
            </button>

            <button onClick={() => handleMenuAction("share_link")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              {t.share_link}
            </button>
            <button onClick={() => handleMenuAction("copy_link")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              {t.copy_link}
            </button>
            <button onClick={() => handleMenuAction("save_link")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              {t.save_link}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
