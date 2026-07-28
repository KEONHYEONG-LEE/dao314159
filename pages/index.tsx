"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header"; 
import { CategoryTabs } from "../components/category-tabs";
import { CategoryNews } from "../components/category-news";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { translations } from "../lib/translations";

const CATEGORIES = [
  "all", "poll", "mainnet", "node", "mining", "wallet", "browser", 
  "roadmap", "whitepaper", "community", "commerce", "kyc", 
  "developer", "ecosystem", "outlook", "price", "security", 
  "legal"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentLang, setCurrentLang] = useState('en'); // 기본 언어 설정 (en, ko, ja, zh, es, vi)
  
  const { user, isAuthenticated, isLoading, loginWithKycId, logout } = usePiNetworkAuthentication();

  const [inputKycId, setInputKycId] = useState("");
  const [inputError, setInputError] = useState("");

  const t = translations[currentLang] || translations['en'];

  const [tickerStats, setTickerStats] = useState<string[]>([
    "📢 실시간 글로벌 파이 뉴스룸 핫이슈 동기화 중입니다...",
    "📢 최신 생태계 핵심 소식 및 마이그레이션 모니터링 가동"
  ]);

  // 실시간 뉴스 패치 로직
  useEffect(() => {
    const loadHotNewsForTicker = async () => {
      try {
        const response = await fetch(`/api/fetch-news?category=${activeCategory}&t=${Date.now()}`);
        const allNews = await response.json();
        
        if (Array.isArray(allNews) && allNews.length > 0) {
          const cleanText = (text: string) => text.replace(/<\/?[^>]+(>|$)/g, "").trim();
          
          const hotHeadlines = allNews.slice(0, 5).map((item: any, idx: number) => {
            return `🔥 [실시간 핫이슈 ${idx + 1}] ${cleanText(item.title)}`;
          });
          
          setTickerStats(hotHeadlines);
        }
      } catch (error) {
        console.error("전광판 실시간 뉴스 연동 실패:", error);
      }
    };

    loadHotNewsForTicker();
    const interval = setInterval(loadHotNewsForTicker, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  const sXRef = useRef<number | null>(null);
  const eXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    sXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    eXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (sXRef.current === null || eXRef.current === null) return;
    const distance = sXRef.current - eXRef.current;
    const currentIndex = CATEGORIES.indexOf(activeCategory);

    if (currentIndex === -1) return;

    if (distance > 75 && currentIndex < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIndex + 1]);
    } else if (distance < -75 && currentIndex > 0) {
      setActiveCategory(CATEGORIES[currentIndex - 1]);
    }

    sXRef.current = null;
    eXRef.current = null;
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKycId.trim()) {
      setInputError("KYC 인증 ID 또는 지갑 주소를 입력해 주세요.");
      return;
    }
    
    const success = loginWithKycId(inputKycId);
    if (success) {
      setInputError("");
    }
  };

  // 1. 인증 정보 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center text-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-sm font-medium tracking-wide">{t.loading}</p>
      </div>
    );
  }

  // 2. 미인증 상태일 때: KYC 인증 모달 단독 리턴
  if (!isAuthenticated || !user || !user.username) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-[#1e293b] border border-purple-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-600/20 rounded-xl border border-purple-500/30">
              <span className="text-xl">🔐</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">KYC 인증 ID 로그인</h2>
              <p className="text-xs text-slate-400">GPNR 글로벌 앱 진입 단계</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            {t.login_msg}
          </p>

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1.5">
                KYC 인증 ID / Wallet Address
              </label>
              <textarea
                rows={3}
                value={inputKycId}
                onChange={(e) => {
                  setInputKycId(e.target.value);
                  if (inputError) setInputError("");
                }}
                placeholder="예: GAC7XH... 또는 파이 KYC 식별자 입력"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
              {inputError && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{inputError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-200 active:scale-[0.98]"
            >
              인증 확인 및 앱 진입하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  const displayId = user?.username
    ? user.username.length > 15
      ? `${user.username.substring(0, 6)}...${user.username.substring(user.username.length - 6)}`
      : user.username
    : "";

  // 3. 인증 완료 시 메인 화면
  return (
    <main 
      className="min-h-screen bg-[#0f172a] text-slate-100 touch-pan-y relative pb-12"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. 글로벌 상단 헤더 (다국어 및 Quick Link 바인딩 추가) */}
      <Header 
        currentCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
      />

      {/* 2. 전광판 */}
      <div className="w-full bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-slate-300 py-2.5 overflow-hidden sticky top-[60px] z-[55] shadow-md shadow-black/20">
        <div className="flex whitespace-nowrap gap-16 text-[12px] font-bold text-slate-900 tracking-wide compliance-marquee">
          <div className="flex gap-16 shrink-0 justify-around min-w-full">
            {tickerStats.map((stat, idx) => (
              <span key={`stat-1-${idx}`} className="hover:text-blue-600 transition-colors">{stat}</span>
            ))}
          </div>
          <div className="flex gap-16 shrink-0 justify-around min-w-full">
            {tickerStats.map((stat, idx) => (
              <span key={`stat-2-${idx}`} className="hover:text-blue-600 transition-colors">{stat}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 카테고리 탭 바 */}
      <div className="sticky top-[93px] z-50 bg-[#0f172a]/95 backdrop-blur-sm">
        <CategoryTabs 
          selectedCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
          currentLang={currentLang}
        />
      </div>

      {/* 4. 연동 정보 배너 */}
      {isAuthenticated && user && (
        <div className="max-w-3xl mx-auto px-4 mt-3">
          <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-3 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-300 font-medium">{t.wallet_connected}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded border border-purple-800/30">
                {displayId}
              </span>
              <button 
                onClick={logout} 
                className="text-[10px] text-slate-400 hover:text-rose-400 underline ml-1"
              >
                {t.change_id}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 메인 콘텐츠 피드 영역 */}
      <div className="max-w-3xl mx-auto px-4 transition-opacity duration-300 mt-2">
        <CategoryNews selectedCategory={activeCategory} currentLang={currentLang} />
      </div>

      {/* 하단 6개 언어 선택 플로팅 버튼 */}
      <div className="fixed bottom-4 right-4 z-[99]">
        <select
          value={currentLang}
          onChange={(e) => setCurrentLang(e.target.value)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-2 rounded-full shadow-lg border border-blue-400/30 focus:outline-none cursor-pointer"
        >
          <option value="en" className="bg-[#1e293b] text-white">🌐 English</option>
          <option value="ko" className="bg-[#1e293b] text-white">🌐 한국어</option>
          <option value="ja" className="bg-[#1e293b] text-white">🌐 日本語</option>
          <option value="zh" className="bg-[#1e293b] text-white">🌐 简体中文</option>
          <option value="es" className="bg-[#1e293b] text-white">🌐 Español</option>
          <option value="vi" className="bg-[#1e293b] text-white">🌐 Tiếng Việt</option>
        </select>
      </div>

      {/* 전광판 애니메이션 */}
      <span dangerouslySetInnerHTML={{ __html: `
        <style>
          @keyframes gpnrMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .compliance-marquee {
            animation: gpnrMarquee 40s linear infinite !important;
          }
          .compliance-marquee:active, .compliance-marquee:hover {
            animation-play-state: paused !important;
          }
        </style>
      `}} />
    </main>
  );
}
