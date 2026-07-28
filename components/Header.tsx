"use client";

import { useState, useEffect } from "react";
import { 
  Flame, Globe, Monitor, Zap, Wallet, Compass, 
  Map, FileText, Users, ShoppingCart, ShieldCheck, 
  Code, Home, TrendingUp, DollarSign, Shield, Gavel,
  Coins
} from "lucide-react";

interface HeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void;
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
}

declare global {
  interface Window {
    Pi: any;
  }
}

const QUICK_LINKS = [
  { id: "all", label: "주요뉴스", icon: <Flame className="w-5 h-5 text-rose-500" /> },
  { id: "mainnet", label: "메인넷", icon: <Globe className="w-5 h-5 text-blue-400" /> },
  { id: "node", label: "노드", icon: <Monitor className="w-5 h-5 text-sky-400" /> },
  { id: "mining", label: "채굴", icon: <Zap className="w-5 h-5 text-amber-400" /> },
  { id: "wallet", label: "지갑", icon: <Wallet className="w-5 h-5 text-pink-400" /> },
  { id: "browser", label: "브라우저", icon: <Compass className="w-5 h-5 text-emerald-400" /> },
  { id: "roadmap", label: "로드맵", icon: <Map className="w-5 h-5 text-red-400" /> },
  { id: "whitepaper", label: "백서", icon: <FileText className="w-5 h-5 text-yellow-300" /> },
  { id: "community", label: "커뮤니티", icon: <Users className="w-5 h-5 text-indigo-400" /> },
  { id: "commerce", label: "커머스", icon: <ShoppingCart className="w-5 h-5 text-pink-500" /> },
  { id: "kyc", label: "KYC", icon: <ShieldCheck className="w-5 h-5 text-purple-400" /> },
  { id: "developer", label: "개발자", icon: <Code className="w-5 h-5 text-amber-500" /> },
  { id: "outlook", label: "부동산", icon: <Home className="w-5 h-5 text-emerald-500" /> },
  { id: "price", label: "전망시세", icon: <TrendingUp className="w-5 h-5 text-cyan-400" /> },
  { id: "price_alt", label: "가격", icon: <DollarSign className="w-5 h-5 text-yellow-400" /> },
  { id: "security", label: "보안", icon: <Shield className="w-5 h-5 text-rose-400" /> },
  { id: "legal", label: "관련법규", icon: <Gavel className="w-5 h-5 text-slate-300" /> }
];

export function Header({ 
  currentCategory = "all", 
  onCategoryChange,
  currentLang = "en",
  onLanguageChange
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 파이 메인넷 10단계 검증용 테스트 결제 함수
  const handleTestPayment = async () => {
    if (typeof window === "undefined" || !window.Pi) {
      alert("Pi Browser에서 접속해 주세요.");
      return;
    }

    try {
      setIsPaymentLoading(true);
      
      // 파이 결제 객체 생성
      window.Pi.createPayment({
        amount: 0.01,
        memo: "GPNR Mainnet Verification Test Payment",
        metadata: { type: "mainnet_verification" },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          await fetch("/api/pi/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          await fetch("/api/pi/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
          alert("테스트 결제가 완료되었습니다! Developer Portal을 확인하세요.");
          setIsPaymentLoading(false);
        },
        onCancel: (paymentId: string) => {
          setIsPaymentLoading(false);
        },
        onError: (error: any) => {
          console.error("Payment error:", error);
          alert("결제 중 오류가 발생했습니다.");
          setIsPaymentLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      setIsPaymentLoading(false);
    }
  };

  if (!mounted) {
    return (
      <header className="w-full h-[60px] bg-[#0f172a]/90 border-b border-slate-800"></header>
    );
  }

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange?.(categoryId);
    setIsLauncherOpen(false);
  };

  return (
    <div className="notranslate" translate="no">
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/90 border-b border-slate-800 backdrop-blur-xl transition-colors">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            
            {/* 로고 */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onCategoryChange?.('all')}>
              <span className="font-black text-2xl tracking-tighter text-purple-500 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]">
                GPNR
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2">
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 영역 (10단계 테스트 결제 버튼 + 9점 그리드 메뉴) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestPayment}
                disabled={isPaymentLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 active:scale-95 transition-all disabled:opacity-50"
              >
                <Coins className="w-4 h-4 text-yellow-300" />
                <span>{isPaymentLoading ? "진행 중..." : "0.01 Pi 후원"}</span>
              </button>

              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                title="Quick Navigation"
                className={`p-2 rounded-xl transition-all ${
                  isLauncherOpen 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' 
                    : 'text-slate-300 bg-slate-800/80 hover:bg-slate-700'
                }`}
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M6 10a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4zM6 16a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4zM6 22a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </header>

      {isLauncherOpen && (
        <div 
          className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-xs" 
          onClick={() => setIsLauncherOpen(false)}
        />
      )}

      {isLauncherOpen && (
        <div className="fixed left-1/2 top-[70px] -translate-x-1/2 z-[80] w-[92%] max-w-sm bg-[#131b2e] border border-slate-700/80 p-4 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95">
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK_LINKS.map((item) => {
              const isSelected = currentCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleCategorySelect(item.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-150 active:scale-95 ${
                    isSelected
                      ? "bg-purple-900/40 border border-purple-500/50 shadow-inner"
                      : "bg-[#1e293b]/80 hover:bg-slate-800 border border-slate-700/50"
                  }`}
                >
                  <div className="mb-1.5 p-2 bg-slate-900/60 rounded-xl border border-slate-700/40">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 tracking-tight">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
