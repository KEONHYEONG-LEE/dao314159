"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Lock, Share2 } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2";
import { shareNews, stripHtml } from "@/lib/utils";

export function LatestNews() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLogin = () => {
      const savedId = localStorage.getItem("pi_user_id");
      setIsLoggedIn(!!savedId);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    // 외부 클릭 및 스크롤 시 컨텍스트 메뉴 닫기
    const handleOutsideClick = () => closeContextMenu();
    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", handleOutsideClick);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("scroll", handleOutsideClick);
    };
  }, []);

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

  // 모바일 롱 프레스 터치 핸들러
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

  // 우클릭 핸들러
  const handleContextMenu = (
    itemData: { id: string; url: string; title: string; content: string },
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    openContextMenu(itemData, e.clientX, e.clientY);
  };

  // 팝업 메뉴 액션 핸들러
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
        navigator.clipboard.writeText(`${title}\n${stripHtml(content)}`);
        alert("기사 텍스트가 복사되었습니다.");
        break;
      case "share_link":
        if (navigator.share) {
          navigator.share({ title, url }).catch(() => {});
        } else {
          navigator.clipboard.writeText(url);
          alert("링크가 복사되었습니다.");
        }
        break;
      case "copy_link":
        navigator.clipboard.writeText(url);
        alert("링크가 클립보드에 복사되었습니다.");
        break;
      case "save_link":
        alert("기사가 저장되었습니다.");
        break;
      default:
        break;
    }
    closeContextMenu();
  };

  const getText = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field.ko || field.en || "";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const isValidUrl = (url?: string) => {
    if (!url || typeof url !== "string") return false;
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleToggleExpand = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const handleExternalClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareClick = async (e: React.MouseEvent, news: any) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    const title = getText(news.title);
    const rawContent = getText(news.content);
    const cleanContent = stripHtml(rawContent);

    await shareNews({
      title: title,
      text: cleanContent.slice(0, 100) + "...",
      url: news.sourceUrl,
    });
  };

  return (
    <section className="py-6 px-1 bg-[#0a0a0a] relative">
      <div className="flex flex-col">
        {NEWS_DATA.map((news) => {
          const hasValidImage = isValidUrl(news.imageUrl) && !imageErrors[news.id];
          const titleStr = getText(news.title);
          const contentStr = getText(news.content);
          const itemData = {
            id: news.id,
            url: news.sourceUrl || "#",
            title: titleStr,
            content: contentStr,
          };

          return (
            <div key={news.id} className="border-b border-white/[0.08]">
              <article
                onTouchStart={(e) => handleTouchStart(itemData, e)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchEnd}
                onContextMenu={(e) => handleContextMenu(itemData, e)}
                onClick={() => {
                  if (isLongPress.current) {
                    isLongPress.current = false;
                    return;
                  }
                  handleToggleExpand(news.id);
                }}
                className={`flex gap-4 py-5 px-3 transition-all cursor-pointer items-center justify-between select-none ${
                  expandedId === news.id ? "bg-white/[0.07]" : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded font-bold uppercase">
                      {news.category}
                    </span>
                    {!isLoggedIn && <Lock className="w-3 h-3 text-slate-500" />}
                  </div>
                  <h3
                    className={`text-[15px] font-semibold leading-[1.5] mb-2 transition-colors ${
                      expandedId === news.id ? "text-blue-400" : "text-slate-200"
                    } ${expandedId !== news.id ? "line-clamp-2" : ""}`}
                  >
                    {titleStr}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span className="text-blue-400 font-medium">{news.author}</span>
                    <span>{formatDate(news.publishedAt)}</span>
                    {expandedId === news.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </div>

                {/* 썸네일 영역 */}
                {hasValidImage && expandedId !== news.id && (
                  <div className="w-[70px] h-[70px] rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
                    <img
                      src={news.imageUrl}
                      alt=""
                      onError={() => handleImageError(news.id)}
                      className="w-full h-full object-cover block"
                    />
                  </div>
                )}
              </article>

              {/* 상세 보기 영역 */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  expandedId === news.id && isLoggedIn
                    ? "max-h-[5000px] opacity-100 border-t border-white/[0.05]"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-5 bg-white/[0.02]">
                  {hasValidImage && (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-5 bg-slate-800">
                      <img
                        src={news.imageUrl}
                        alt=""
                        onError={() => handleImageError(news.id)}
                        className="w-full h-full object-cover block"
                      />
                    </div>
                  )}

                  <div className="text-slate-300 text-[15px] underline-offset-4 leading-[1.9] whitespace-pre-wrap break-words">
                    {contentStr}
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/[0.05] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => handleExternalClick(e, news.sourceUrl)}
                        className="text-[13px] text-blue-400 flex items-center gap-1.5 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>원문 출처 이동</span>
                      </button>

                      <button
                        onClick={(e) => handleShareClick(e, news)}
                        className="text-[13px] text-slate-400 flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>공유하기</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(null);
                      }}
                      className="text-[12px] text-slate-500 hover:text-slate-300"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 구글 크롬 스타일 컨텍스트 메뉴 팝업 */}
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
