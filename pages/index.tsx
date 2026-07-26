"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header"; 

import { CategoryTabs } from "../components/category-tabs";
import { CategoryNews } from "../components/category-news";

import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";

const CATEGORIES = [
  "all", "poll", "mainnet", "node", "mining", "wallet", "browser", 
  "roadmap", "whitepaper", "community", "commerce", "kyc", 
  "developer", "ecosystem", "outlook", "price", "security", 
  "legal"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { user, isAuthenticated, isLoading, loginWithKycId, logout } = usePiNetworkAuthentication();

  const [inputKycId, setInputKycId] = useState("");
  const [inputError, setInputError] = useState("");

  const [tickerStats, setTickerStats] = useState<string[]>([
    "📢 실시간 글로벌 파이 뉴스룸 핫이슈 동기화 중입니다...",
    "📢 최신 생태계 핵심 소식 및 마이그레이션 모니터링 가동"
  ]);

  useEffect(() => {
    const loadHotNewsForTicker = async () => {
      try {
        const response = await fetch("/api/fetch-news?category=all");
        const allNews = await response.json();
        
        if (allNews && allNews.length > 0) {
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
    const interval = setInterval(loadHotNewsForTicker, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
      // 알림창(alert) 없이 곧바로 메인 앱 화면이 렌더링되도록 처리
    }
  };

  // 1. 인증 정보 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center text-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-sm font-medium tracking-wide">Pi Network 인증 정보 확인 중...</p>
      </div>
    );
  }

  // 2. [핵심 수정] 미인증 상태일 때: Header나 뉴스 등 본체는 읽지도 않고 오직 팝업만 단독 리턴!
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
              <p className="text-xs text-slate-400">10단계 통과 및 GPNR 앱 진입 단계</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            파이 네트워크 KYC 인증 ID 또는 56자리 지갑 주소를 입력하시면 지갑이 정상 연동되며 앱 메인에 진입합니다.
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

  // 3. 인증이 통과되었을 때만 비로소 아래 메인 GPNR 앱 화면을 그립니다.
  return (
    <main 
      className="min-h-screen bg-[#0f172a] text-slate-100 touch-pan-y relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. 글로벌 상단 헤더 */}
      <Header 
        currentCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
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
        />
      </div>

      {/* 4. 연동 정보 배너 */}
      {isAuthenticated && user && (
        <div className="max-w-3xl mx-auto px-4 mt-3">
          <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-3 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-medium">Pi 네트워크 지갑 연동 완료</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded border border-purple-800/30">
                {displayId}
              </span>
              <button 
                onClick={logout} 
                className="text-[10px] text-slate-400 hover:text-rose-400 underline ml-1"
              >
                ID 변경
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 메인 콘텐츠 및 투표 피드 영역 */}
      <div className="max-w-3xl mx-auto px-4 transition-opacity duration-300 mt-2">
        <CategoryNews selectedCategory={activeCategory} />
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
