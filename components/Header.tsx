// @ts-nocheck
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";

interface GpnrHeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
  currentLanguage?: string;                     
}

// 첫 번째 스크린샷(20633.jpg)과 정확히 일치하는 17개 카테고리 구성
const GRID_CATEGORIES = [
  { id: "top-news", label: "주요뉴스", enLabel: "Top News", icon: "🔥" },
  { id: "mainnet", label: "메인넷", enLabel: "Mainnet", icon: "🌐" },
  { id: "node", label: "노드", enLabel: "Node", icon: "💻" },
  { id: "mining", label: "채굴", enLabel: "Mining", icon: "⚡" },
  { id: "wallet", label: "지갑", enLabel: "Wallet", icon: "👛" },
  { id: "browser", label: "브라우저", enLabel: "Browser", icon: "🧭" },
  { id: "roadmap", label: "로드맵", enLabel: "Roadmap", icon: "🗺️" },
  { id: "whitepaper", label: "백서", enLabel: "Whitepaper", icon: "📄" },
  { id: "community", label: "커뮤니티", enLabel: "Community", icon: "👥" },
  { id: "commerce", label: "커머스", enLabel: "Commerce", icon: "🛒" },
  { id: "kyc", label: "KYC", enLabel: "KYC", icon: "🛡️" },
  { id: "developer", label: "개발자", enLabel: "Developer", icon: "</>" },
  { id: "ecosystem", label: "부동산", enLabel: "Real Estate", icon: "🏠" },
  { id: "outlook", label: "전망시세", enLabel: "Outlook", icon: "📈" },
  { id: "price", label: "가격", enLabel: "Price", icon: "💲" },
  { id: "security", label: "보안", enLabel: "Security", icon: "🛡️" },
  { id: "legal", label: "관련법규", enLabel: "Legal", icon: "🔨" },
];

export function GpnrHeader({ 
  currentCategory = "top-news", 
  onCategoryChange,
  currentLanguage
}: GpnrHeaderProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false); 
  const [currentLang, setCurrentLang] = useState<string>("ko");

  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();

  useEffect(() => {
    setMounted(true);
    const syncLanguage = () => {
      const targetLang = currentLanguage || localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "ko";
      setCurrentLang(targetLang);
    };

    syncLanguage();
    window.addEventListener("storage", syncLanguage);
    window.addEventListener("languageChange", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener("languageChange", syncLanguage);
    };
  }, [currentLanguage]);

  const handleDonation = useCallback(async () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      try {
        const origin = window.location.origin;
        await (window as any).Pi.createPayment({
          amount: 0.001,
          memo: currentLang === "ko" ? "GPNR 서비스 후원" : "GPNR Service Donation",
          metadata: { type: "one-time-donation", app: "GPNR" }
        }, {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch(`${origin}/api/payments/approve`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ paymentId }) 
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            await fetch(`${origin}/api/payments/complete`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ paymentId, txid }) 
            });
            alert(currentLang === "ko" ? "0.001 Pi 후원이 완료되었습니다. 감사합니다!" : "0.001 Pi donation completed. Thank you!");
          },
          onCancel: (paymentId: string) => console.log("취소됨", paymentId),
          onError: (error: Error) => console.error("에러", error),
        });
      } catch (err) {
        console.error("Pi SDK payment failed:", err);
      }
    } else {
      alert(currentLang === "ko" ? "Pi Browser에서 접속해주세요." : "Please access through Pi Browser.");
    }
  }, [currentLang]);

  if (!mounted) return null;

  const displayId = user?.username
    ? user.username.length > 12
      ? `${user.username.substring(0, 5)}...${user.username.substring(user.username.length - 4)}`
      : user.username
    : "";

  return (
    <>
      {/* 상단 GPNR 헤더 바 */}
      <header className="sticky top-0 z-[60] w-full bg-[#0d0f1d] border-b border-slate-800/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-[48px] items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wider text-purple-400">GPNR</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDonation} 
                className="flex items-center gap-1 bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30 hover:bg-purple-800/50 text-[11px] font-bold"
              >
                <span>🪙</span>
                <span>0.01 Pi 후원</span>
              </button>

              {/* 9개 점 그리드 모달 오픈 버튼 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700/50"
              >
                <div className="grid grid-cols-3 gap-0.5 w-4 h-4 items-center justify-center">
                  {[...Array(9)].map((_, i) => (
                    <span key={i} className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  ))}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 20633.jpg 스크린샷과 100% 동일한 그리드 레이어 모달 */}
      {isLauncherOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-[#131528] border border-purple-500/30 rounded-3xl p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button 
              onClick={() => setIsLauncherOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1"
            >
              ✕
            </button>

            {/* 3x6 그리드 아이콘 영역 (첫 번째 사진과 동일한 디자인) */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {GRID_CATEGORIES.map((item) => {
                const isSelected = currentCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onCategoryChange) onCategoryChange(item.id);
                      setIsLauncherOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center h-[88px] rounded-2xl transition-all border ${
                      isSelected
                        ? "bg-[#2d1b4e] border-purple-500 text-white shadow-lg shadow-purple-900/40"
                        : "bg-[#1c1e36]/80 border-slate-800/80 text-slate-300 hover:bg-[#252846]"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{item.icon}</span>
                    <span className="text-[12px] font-bold text-slate-200">
                      {currentLang === "ko" ? item.label : item.enLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 계정 정보 / ID 해제 영역 */}
            {isAuthenticated && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>연결된 ID: <strong className="text-purple-300 font-mono">{displayId}</strong></span>
                <button
                  onClick={() => {
                    logout();
                    setIsLauncherOpen(false);
                  }}
                  className="text-rose-400 hover:underline text-[11px]"
                >
                  ID 변경
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
