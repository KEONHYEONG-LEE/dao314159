// @ts-nocheck
"use client";

import { useEffect, useState, useRef } from "react";
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

  // 크롬 스타일 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    item: { id: string; url: string; title: string; content: string } | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

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

    // 외부 클릭 및 스크롤 시 팝업 닫기
    const handleOutsideClick = () => closeContextMenu();
    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("scroll", handleOutsideClick);
    };
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

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const openContextMenu = (
    itemData: { id: string; url: string; title: string; content: string },
    clientX: number,
    clientY: number
  ) => {
    const menuWidth = 260;
    const menuHeight = 380;
    const x = Math.min(clientX, window.innerWidth - menuWidth - 16);
    const y = Math.min(clientY, window.innerHeight - menuHeight - 16);

    setContextMenu({
      visible: true,
      x: Math.max(16, x),
      y: Math.max(16, y),
      item: itemData,
    });
  };

  // 모바일 롱 프레스 터치 이벤트
  const handleTouchStart = (
    itemData: { id: string; url: string; title: string; content: string },
    e: React.TouchEvent
  ) => {
    isLongPress.current = false;
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      openContextMenu(itemData, clientX, clientY);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // 우클릭 이벤트 (PC/웹뷰)
  const handleContextMenu = (
    itemData: { id: string; url: string; title: string; content: string },
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    openContextMenu(itemData, e.clientX, e.clientY);
  };

  // 팝업 메뉴 클릭 액션
  const handleMenuAction = (action: string) => {
    if (!contextMenu.item) return;
    const { id, url, title, content } = contextMenu.item;

    switch (action) {
      case "open_new_tab":
      case "open_group_tab":
      case "open_bg_tab":
      case "open_new_window":
      case "open_incognito":
        window.open(url, "_blank");
        break;
      case "select_text":
        navigator.clipboard.writeText(`${title}\n${content}`);
        alert(currentLang === "ko" ? "기사 텍스트가 복사되었습니다." : "Text copied.");
        break;
      case "share_link":
        if (navigator.share) {
          navigator.share({ title, url }).catch(() => {});
        } else {
          navigator.clipboard.writeText(url);
          alert(currentLang === "ko" ? "링크가 복사되었습니다." : "Link copied.");
        }
        break;
      case "copy_link":
        navigator.clipboard.writeText(url);
        alert(currentLang === "ko" ? "링크가 클립보드에 복사되었습니다." : "Link copied to clipboard.");
        break;
      case "save_link":
        setStarredIds((prev) => {
          const updated = { ...prev, [id]: true };
          try { localStorage.setItem("gpnr_news_starred", JSON.stringify(updated)); } catch (err) {}
          return updated;
        });
        alert(currentLang === "ko" ? "기사가 즐겨찾기에 저장되었습니다." : "Link saved.");
        break;
      default:
        break;
    }
    closeContextMenu();
  };

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
    <section className="py-2 px-1 bg-[#0f172a] relative">
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
              const contentStr = getParsedText(article.content);
              const sourceStr = article.author || article.source || "GPNR News";
              const rawDateStr = article.publishedAt || article.date || "";
              const dateStr = formatDateOnly(rawDateStr);
              const imageSrc = article.imageUrl || article.image || "https://picsum.photos/id/10/200/200";
              const targetUrl = article.sourceUrl || article.url || "#";

              const isChecked = !!checkedIds[articleId];
              const isStarred = !!starredIds[articleId];
              const isLiked = !!likedIds[articleId];

              const itemData = { id: articleId, url: targetUrl, title: titleStr, content: contentStr };

              return (
                <a
                  key={articleId}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border-b border-white/[0.05] last:border-0 select-none"
                  onTouchStart={(e) => handleTouchStart(itemData, e)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchEnd}
                  onContextMenu={(e) => handleContextMenu(itemData, e)}
                  onClick={(e) => {
                    if (isLongPress.current) {
                      e.preventDefault();
                      isLongPress.current = false;
                    }
                  }}
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

      {/* 구글 크롬 스타일 컨텍스트 메뉴 팝업 (첫 번째 사진 메뉴 100% 동일 구현) */}
      {contextMenu.visible && contextMenu.item && (
        <div 
          className="fixed z-50 w-64 bg-gray-900/95 text-gray-200 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 py-2.5 text-sm overflow-hidden transition-all duration-150 animate-in fade-in zoom-in-95"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* 상단 URL 헤더 */}
          <div className="px-4 py-2 border-b border-gray-700/60 text-xs text-gray-400 truncate">
            {contextMenu.item.url}
          </div>

          {/* 메뉴 리스트 */}
          <div className="py-1">
            <button onClick={() => handleMenuAction("open_new_tab")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              새 탭에서 열기
            </button>
            <button onClick={() => handleMenuAction("open_group_tab")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              탭 그룹에서 열기
            </button>
            <button onClick={() => handleMenuAction("open_bg_tab")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              백그라운드 탭에서 열기
            </button>
            <button onClick={() => handleMenuAction("open_new_window")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              다른 창에서 열기
            </button>
            <button onClick={() => handleMenuAction("open_incognito")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors border-b border-gray-700/60 pb-2.5 mb-1">
              비밀 모드에서 열기
            </button>

            <button onClick={() => handleMenuAction("select_text")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors border-b border-gray-700/60 pb-2.5 mb-1">
              텍스트 선택
            </button>

            <button onClick={() => handleMenuAction("share_link")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              링크 공유
            </button>
            <button onClick={() => handleMenuAction("copy_link")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              링크 복사
            </button>
            <button onClick={() => handleMenuAction("save_link")} className="w-full text-left px-4 py-2 hover:bg-gray-800/80 active:bg-gray-700 transition-colors">
              링크 저장
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
