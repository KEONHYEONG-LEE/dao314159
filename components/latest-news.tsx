"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Lock, Share2 } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2";
import { shareNews, stripHtml } from "@/lib/utils";

// 팝업 메뉴 다국어 텍스트 정의
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
    link_saved: "기사가 저장되었습니다.",
    login_required: "로그인 후 이용해 주세요.",
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
    login_required: "Please log in to use this feature.",
  },
};

export function LatestNews() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // 현재 앱 언어 상태 (기본값: 'en', localStorage 또는 system 설정 연동)
  const [lang, setLang] = useState<"ko" | "en">("en");

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

  // 현재 설정된 언어의 텍스트 가져오기
  const t = MENU_TEXTS[lang] || MENU_TEXTS.en;

  useEffect(() => {
    const checkLogin = () => {
      const savedId = localStorage.getItem("pi_user_id");
      setIsLoggedIn(!!savedId);
      
      // 앱의 언어 설정 감지 (localStorage의 gpnr_lang 또는 pi_lang 값 체크)
      const savedLang = localStorage.getItem("gpnr_lang") || localStorage.getItem("pi_lang");
      if (savedLang === "ko" || savedLang === "en") {
        setLang(savedLang as "ko" | "en");
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

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

  const handleContextMenu = (
    itemData: { id: string; url: string; title: string; content: string },
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    openContextMenu(itemData, e.clientX, e.clientY);
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
        navigator.clipboard.writeText(`${title}\n${stripHtml(content)}`);
        alert(t.text_copied);
        break;
      case "share_link":
        if (navigator.share) {
          navigator.share({ title, url }).catch(() => {});
        } else {
          navigator.clipboard.writeText(url);
          alert(t.link_copied);
        }
        break;
      case "copy_link":
        navigator.clipboard.writeText(url);
        alert(t.link_copied);
        break;
      case "save_link":
        alert(t.link_saved);
        break;
      default:
        break;
    }
    closeContextMenu();
  };

  const getText = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field.ko || field.en || "";
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
      alert(t.login_required);
      return;
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const handleExternalClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert(t.login_required);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareClick = async (e: React.MouseEvent, news: any) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert(t.login_required);
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
                        <span>{lang === "ko" ? "원문 출처 이동" : "Original Source"}</span>
                      </button>

                      <button
                        onClick={(e) => handleShareClick(e, news)}
                        className="text-[13px] text-slate-400 flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{lang === "ko" ? "공유하기" : "Share"}</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(null);
                      }}
                      className="text-[12px] text-slate-500 hover:text-slate-300"
                    >
                      {lang === "ko" ? "닫기" : "Close"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 동적 언어 반영 크롬 스타일 컨텍스트 메뉴 팝업 */}
      {contextMenu.visible && contextMenu.item && (
        <div 
          className="fixed z-50 w-64 bg-gray-900/95 text-gray-200 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 py-2.5 text-sm overflow-hidden transition-all duration-150 animate-in fade-in zoom-in-95"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
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
    </section>
  );
}
