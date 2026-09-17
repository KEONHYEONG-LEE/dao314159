import { useState, useRef, useEffect, Component, ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import * as TranslationsModule from "../lib/translations";
import * as CategoriesModule from "../lib/categories";

// Client-side Exception 및 Import Mismatch를 방지하기 위한 Dynamic Imports
const HeaderComp = dynamic(
  () => import("../components/Header").then((mod) => mod.GpnrHeader || mod.Header || mod.default),
  { ssr: false, loading: () => <div className="h-[48px] bg-[#0f172a]" /> }
);

const CategoryTabsComp = dynamic(
  () => import("../components/category-tabs").then((mod) => mod.CategoryTabs || mod.default),
  { ssr: false, loading: () => <div className="h-[40px] bg-[#0f172a]" /> }
);

const CategoryNews = dynamic(
  () => import("../components/category-news").then((mod) => mod.CategoryNews || mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="py-12 text-center text-slate-400 text-sm">
        뉴스를 불러오는 중입니다...
      </div>
    ),
  }
);

// 화면 전체가 뻗는 것을 방지하는 Error Boundary 컴포넌트
class SafeComponentWrapper extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("화면 렌더링 연동 예외 발생:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center text-xs text-rose-400 bg-rose-950/20 rounded-lg border border-rose-900/40 my-2">
          컴포넌트를 불러오는 중 일시적인 오류가 발생했습니다.
        </div>
      );
    }
    return this.props.children;
  }
}

const DEFAULT_CATEGORIES = [
  "top-news", "mainnet", "node", "mining", "wallet",
  "browser", "roadmap", "whitepaper", "community", "commerce",
  "kyc", "developer", "ecosystem", "outlook", "price", "security", "legal"
];

const categoriesList = Array.isArray((CategoriesModule as any)?.NEWS_CATEGORIES)
  ? (CategoriesModule as any).NEWS_CATEGORIES.map((c: any) => c.id)
  : DEFAULT_CATEGORIES;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('top-news');
  const [currentLang, setCurrentLang] = useState('en');
  const [mounted, setMounted] = useState(false);

  // 인증 훅 예외 방어
  let authResult: any = { user: null, isAuthenticated: false, isLoading: false };
  try {
    const auth = usePiNetworkAuthentication();
    if (auth) authResult = auth;
  } catch (e) {
    console.error("파이 인증 훅 예외 발생:", e);
  }

  const { user, isAuthenticated, isLoading, loginWithKycId, logout } = authResult;

  const [inputKycId, setInputKycId] = useState("");
  const [inputError, setInputError] = useState("");

  // 번역 언어 데이터 안전 참조
  const translations = (TranslationsModule as any)?.translations || {};
  const t = translations[currentLang] || translations['en'] || translations['ko'] || {
    loading: "Loading GPNR Mainnet App...",
    login_msg: "Please enter your Pi Mainnet Wallet / KYC ID to proceed.",
    wallet_connected: "Pi Mainnet Connected",
    change_id: "Change ID"
  };

  const [tickerStats, setTickerStats] = useState<string[]>([
    "📢 GPNR 파이 메인넷 글로벌 실시간 뉴스룸 동기화 중...",
    "📢 메인넷 노드, 생태계 마이그레이션 모니터링 가동 중"
  ]);

  useEffect(() => {
    setMounted(true);

    const loadHotNewsForTicker = async () => {
      try {
        const response = await fetch(`/api/fetch-news?category=top-news&t=${Date.now()}`);
        if (!response.ok) throw new Error("Network response error");

        const allNews = await response.json();

        if (Array.isArray(allNews) && allNews.length > 0) {
          const cleanText = (text: string) => {
            if (!text) return "";
            return String(text)
              .replace(/<[^>]*>?/gm, "")
              .replace(/"/g, '"')
              .replace(/&/g, '&')
              .replace(/</g, '<')
              .replace(/>/g, '>')
              .replace(/'/g, "'")
              .trim();
          };

          const sortedNews = [...allNews].sort((a, b) => {
            const timeA = new Date(a.publishedAt || a.date || 0).getTime();
            const timeB = new Date(b.publishedAt || b.date || 0).getTime();
            return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
          });

          const hotHeadlines = sortedNews
            .slice(0, 5)
            .map((item: any, idx: number) => `🔥 [메인넷 핫이슈${idx + 1}] ${cleanText(item.title || item.snippet || "")}`)
            .filter((headline: string) => headline.length > 10);

          if (hotHeadlines.length > 0) {
            setTickerStats(hotHeadlines);
          }
        }
      } catch (error) {
        console.error("전광판 뉴스 연동 실패:", error);
      }
    };

    loadHotNewsForTicker();
    const interval = setInterval(loadHotNewsForTicker, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sXRef = useRef<number | null>(null);
  const eXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => { sXRef.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { eXRef.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (sXRef.current === null || eXRef.current === null) return;
    const distance = sXRef.current - eXRef.current;
    const currentIndex = categoriesList.indexOf(activeCategory);

    if (currentIndex === -1) return;

    if (distance > 75 && currentIndex < categoriesList.length - 1) {
      setActiveCategory(categoriesList[currentIndex + 1]);
    } else if (distance < -75 && currentIndex > 0) {
      setActiveCategory(categoriesList[currentIndex - 1]);
    }

    sXRef.current = null;
    eXRef.current = null;
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKycId.trim()) {
      setInputError("메인넷 인증 ID 또는 지갑 주소를 입력해 주세요.");
      return;
    }

    if (loginWithKycId) {
      const success = loginWithKycId(inputKycId);
      if (success) setInputError("");
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center text-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-sm font-medium tracking-wide">GPNR 메인넷 로딩 중...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user || !user.username) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-[#1e293b] border border-purple-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-600/20 rounded-xl border border-purple-500/30">
              <span className="text-xl">🔐</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">GPNR 메인넷 로그인</h2>
              <p className="text-xs text-slate-400">Pi Mainnet App Portal</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            {t.login_msg || "Pi KYC ID 또는 지갑 주소를 입력해 주세요."}
          </p>

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1.5">
                Mainnet Wallet / KYC ID
              </label>
              <textarea
                rows={3}
                value={inputKycId}
                onChange={(e) => {
                  setInputKycId(e.target.value);
                  if (inputError) setInputError("");
                }}
                placeholder="GAC7XH... 형태의 파이 메인넷 지갑 주소 입력"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all resize-none"
              />
              {inputError && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{inputError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              메인넷 접속하기
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

  return (
    <main
      className="min-h-screen bg-[#0f172a] text-slate-100 touch-pan-y relative pb-12"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <SafeComponentWrapper>
        <HeaderComp
          currentCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          currentLanguage={currentLang}
        />
      </SafeComponentWrapper>

      <div className="w-full bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-slate-300 py-2.5 overflow-hidden sticky top-[48px] z-[55] shadow-md shadow-black/20">
        <div className="flex whitespace-nowrap gap-16 text-[12px] font-bold text-slate-900 tracking-wide compliance-marquee">
          <div className="flex gap-16 shrink-0 justify-around min-w-full">
            {tickerStats.map((stat, idx) => (
              <span key={`stat-1-${idx}`} className="hover:text-blue-600 transition-colors">
                {stat}
              </span>
            ))}
          </div>
          <div className="flex gap-16 shrink-0 justify-around min-w-full">
            {tickerStats.map((stat, idx) => (
              <span key={`stat-2-${idx}`} className="hover:text-blue-600 transition-colors">
                {stat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky top-[81px] z-50 bg-[#0f172a]/95 backdrop-blur-sm">
        <SafeComponentWrapper>
          <CategoryTabsComp
            selectedCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            language={currentLang}
          />
        </SafeComponentWrapper>
      </div>

      {isAuthenticated && user && (
        <div className="max-w-3xl mx-auto px-4 mt-3">
          <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-3 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-300 font-medium">{t.wallet_connected || "Pi Mainnet Connected"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded border border-purple-800/30">
                {displayId}
              </span>
              <button
                onClick={logout}
                className="text-[10px] text-slate-400 hover:text-rose-400 underline ml-1"
              >
                {t.change_id || "Change ID"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 transition-opacity duration-300 mt-2">
        <SafeComponentWrapper fallback={<div className="p-4 text-center text-xs text-slate-400">뉴스 피드를 불러오는 중입니다.</div>}>
          <CategoryNews selectedCategory={activeCategory} currentLang={currentLang} />
        </SafeComponentWrapper>
      </div>

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

      <style jsx global>{`
        @keyframes gpnrMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .compliance-marquee {
          animation: gpnrMarquee 40s linear infinite !important;
        }
        .compliance-marquee:active,
        .compliance-marquee:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </main>
  );
}
