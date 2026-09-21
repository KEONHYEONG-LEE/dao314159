"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, TrendingUp, ExternalLink } from "lucide-react";
import { stripHtml } from "@/lib/utils";

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

const initialFeaturedArticle = { 
  id: "feat-main", 
  category: "주요이슈", 
  title: "Pi Network's Strategic Vision for 2026: What to Expect", 
  image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000",
  date: "2026.05.10",
  content: "파이 네트워크의 2026년 전략적 비전은 오픈 메인넷 이후의 생태계 확장에 초점을 맞추고 있습니다. 특히 탈중앙화 커머스와 AI 통합을 통한 실질적 유틸리티 창출이 핵심 과제입니다.",
  url: "https://minepi.com"
};

const initialSecondaryArticles = [
  { 
    id: "feat-1", 
    category: "커뮤니티", 
    title: "Global Nodes Reach New Milestone", 
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=200",
    date: "2026.05.09",
    content: "전 세계 파이 노드 수가 역대 최고치를 경신하며 네트워크 보안성이 한층 강화되었습니다.",
    url: "#"
  },
  { 
    id: "feat-2", 
    category: "경제", 
    title: "The Impact of GCV on Pi Ecosystem", 
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=200",
    date: "2026.05.09",
    content: "글로벌 합의 가치(GCV)가 생태계 내부 거래 시장에 미치는 영향에 대한 심층 분석 보고서입니다.",
    url: "#"
  }
];

export function FeaturedNews() {
  const [featured, setFeatured] = useState(initialFeaturedArticle);
  const [secondary, setSecondary] = useState(initialSecondaryArticles);
  const [isTranslating, setIsTranslating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lang, setLang] = useState<"ko" | "en">("en");

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

  const t = MENU_TEXTS[lang] || MENU_TEXTS.en;

  useEffect(() => {
    const savedLang = localStorage.getItem("gpnr_lang") || localStorage.getItem("pi_lang");
    if (savedLang === "ko" || savedLang === "en") {
      setLang(savedLang as "ko" | "en");
    }

    const handleOutsideClick = () => closeContextMenu();
    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", handleOutsideClick);

    return () => {
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-6 px-1 relative">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-bold text-white tracking-tight uppercase">Featured</h2>
        </div>
        <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors">
          {lang === "ko" ? "전체보기" : "View All"} <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 group flex flex-col">
          <article 
            onTouchStart={(e) => handleTouchStart(featured, e)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchEnd}
            onContextMenu={(e) => handleContextMenu(featured, e)}
            onClick={() => {
              if (isLongPress.current) {
                isLongPress.current = false;
                return;
              }
              toggleExpand(featured.id);
            }}
            className={`relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/5 cursor-pointer transition-all select-none ${expandedId === featured.id ? 'rounded-b-none' : ''}`}
          >
            <Image src={featured.image} alt="Featured" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-2 py-0.5 mb-3 text-[10px] font-bold bg-orange-600 text-white rounded uppercase tracking-tighter">
                {featured.category}
              </span>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors">
                {isTranslating ? "Translating..." : featured.title}
              </h3>
              <div className="flex items-center gap-4 text-[11px] text-slate-300 font-medium">
                <span className="text-blue-400 font-bold tracking-widest">GPNR FOCUS</span>
                <span>{featured.date}</span>
              </div>
            </div>
          </article>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden bg-slate-900/40 rounded-b-2xl border-x border-b border-white/5 ${expandedId === featured.id ? 'max-h-[500px] opacity-100 p-6' : 'max-h-0 opacity-0'}`}>
            <p className="text-slate-300 text-[15px] leading-relaxed mb-4">
              {featured.content}
            </p>
            <a href={featured.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-orange-500 font-bold hover:text-orange-400">
              <ExternalLink className="w-4 h-4" /> {lang === "ko" ? "원문 읽기" : "Read Original"}
            </a>
          </div>
        </div>

        <div className="flex flex-col">
          {secondary.map((article, idx) => (
            <div key={article.id} className={`${idx !== 0 ? "mt-1" : ""}`}>
              <article 
                onTouchStart={(e) => handleTouchStart(article, e)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchEnd}
                onContextMenu={(e) => handleContextMenu(article, e)}
                onClick={() => {
                  if (isLongPress.current) {
                    isLongPress.current = false;
                    return;
                  }
                  toggleExpand(article.id);
                }}
                className={`flex gap-4 py-4 px-2 items-center border-b border-white/[0.05] last:border-0 cursor-pointer transition-colors select-none hover:bg-white/[0.03] ${expandedId === article.id ? 'bg-white/[0.05]' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-orange-500 font-bold mb-1 block uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h4 className={`text-[14px] font-semibold leading-snug line-clamp-2 transition-colors mb-2 ${expandedId === article.id ? 'text-blue-400' : 'text-slate-200 group-hover:text-blue-400'}`}>
                    {isTranslating ? "..." : article.title}
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="text-blue-400 font-bold">GPNR</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/5 bg-slate-800">
                  <Image src={article.image} alt="Thumbnail" fill className="object-cover" />
                </div>
              </article>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden bg-black/20 ${expandedId === article.id ? 'max-h-[300px] opacity-100 p-4 border-b border-white/[0.05]' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-400 text-[13px] leading-relaxed mb-3">
                  {article.content}
                </p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-orange-400 font-bold">
                   {lang === "ko" ? "원문 확인" : "Read Original"} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

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
