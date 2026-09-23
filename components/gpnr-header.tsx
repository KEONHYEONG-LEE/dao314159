// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { NEWS_CATEGORIES } from "../lib/categories";

import {
  Flame,
  Globe,
  Tv,
  Zap,
  Wallet,
  Compass,
  Map,
  FileText,
  Users,
  ShoppingCart,
  ShieldCheck,
  Code,
  Building,
  TrendingUp,
  DollarSign,
  Shield,
  Scale,
  Calendar,
  Menu,
  X,
  Newspaper
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "top-news": Flame,
  "top_news": Flame,
  "mainnet": Globe,
  "node": Tv,
  "mining": Zap,
  "wallet": Wallet,
  "browser": Compass,
  "roadmap": Map,
  "whitepaper": FileText,
  "community": Users,
  "commerce": ShoppingCart,
  "kyc": ShieldCheck,
  "developer": Code,
  "developers": Code,
  "ecosystem": Building,
  "real-estate": Building,
  "real_estate": Building,
  "outlook": TrendingUp,
  "price-outlook": TrendingUp,
  "price_outlook": TrendingUp,
  "price": DollarSign,
  "security": Shield,
  "legal": Scale,
  "regulations": Scale,
  "calendar": Calendar,
  "주요 뉴스": Flame,
  "주요뉴스": Flame,
  "메인넷": Globe,
  "노드": Tv,
  "채광": Zap,
  "지갑": Wallet,
  "브라우저": Compass,
  "로드맵": Map,
  "백서": FileText,
  "지역 사회": Users,
  "커뮤니티": Users,
  "상업": ShoppingCart,
  "KYC": ShieldCheck,
  "개발자": Code,
  "생태계": Building,
  "부동산": Building,
  "가격 전망": TrendingUp,
  "가격전망": TrendingUp,
  "가격": DollarSign,
  "보안": Shield,
  "규정": Scale,
  "법률": Scale,
  "달력": Calendar,
  Flame,
  Globe,
  Tv,
  Zap,
  Wallet,
  Compass,
  Map,
  FileText,
  Users,
  ShoppingCart,
  ShieldCheck,
  Code,
  Building,
  TrendingUp,
  DollarSign,
  Shield,
  Scale,
  Calendar,
};

interface GpnrHeaderProps {
  currentCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  currentLanguage?: string;
}

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
      try {
        if (typeof window !== "undefined") {
          const targetLang =
            currentLanguage ||
            localStorage.getItem("language") ||
            localStorage.getItem("gpnr-language") ||
            "ko";
          setCurrentLang(targetLang);
        }
      } catch (e) {
        console.error("Language sync error:", e);
      }
    };

    syncLanguage();
    window.addEventListener("storage", syncLanguage);
    window.addEventListener("languageChange", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener("languageChange", syncLanguage);
    };
  }, [currentLanguage]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isLauncherOpen) {
        document.body.classList.add("gpnr-modal-open");
      } else {
        document.body.classList.remove("gpnr-modal-open");
      }
    }
  }, [isLauncherOpen]);

  const handleDonation = useCallback(async () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      try {
        const origin = window.location.origin;
        await (window as any).Pi.createPayment(
          {
            amount: 0.01,
            memo: currentLang === "ko" ? "GPNR 서비스 후원" : "GPNR Service Donation",
            metadata: { type: "one-time-donation", app: "GPNR" }
          },
          {
            onReadyForServerApproval: async (paymentId: string) => {
              await fetch(`${origin}/api/payments/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId })
              });
            },
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              await fetch(`${origin}/api/payments/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid })
              });
              alert(
                currentLang === "ko"
                  ? "0.01 Pi 후원이 완료되었습니다. 감사합니다!"
                  : "0.01 Pi donation completed. Thank you!"
              );
            },
            onCancel: (paymentId: string) => console.log("[Pi Payment] 취소:", paymentId),
            onError: (error: Error) => console.error("[Pi Payment] 에러:", error)
          }
        );
      } catch (err) {
        console.error("Pi SDK payment failed:", err);
      }
    } else {
      alert(
        currentLang === "ko"
          ? "Pi Browser에서 접속해 주세요."
          : "Please access through Pi Browser."
      );
    }
  }, [currentLang]);

  if (!mounted) return null;

  const displayId = user?.username
    ? user.username.length > 10
      ? `${user.username.substring(0, 4)}...${user.username.substring(user.username.length - 4)}`
      : user.username
    : "";

  const renderCategoryIcon = (category: any) => {
    const FoundIcon =
      ICON_MAP[category.id] ||
      ICON_MAP[category.name] ||
      ICON_MAP[category.enName] ||
      (category.iconName ? ICON_MAP[category.iconName] : null) ||
      (typeof category.icon === "string" ? ICON_MAP[category.icon] : null);

    if (FoundIcon) {
      return <FoundIcon className="w-4 h-4 mb-0.5 text-purple-400 shrink-0" />;
    }

    if (typeof category.icon === "function" || typeof category.Icon === "function") {
      const CustomIcon = category.icon || category.Icon;
      return <CustomIcon className="w-4 h-4 mb-0.5 text-purple-400 shrink-0" />;
    }

    if (typeof category.icon === "string" && (category.icon.startsWith("http") || category.icon.startsWith("/"))) {
      return <img src={category.icon} alt={category.name} className="w-4 h-4 mb-0.5 object-contain shrink-0" />;
    }

    return <Newspaper className="w-4 h-4 mb-0.5 text-purple-400 shrink-0" />;
  };

  return (
    <>
      {/* 모달이 열려있을 때 하단 플로팅 언어 선택 버튼을 감춰서 달력/버튼 터치 방해 제거 */}
      <style jsx global>{`
        body.gpnr-modal-open [class*="fixed"][class*="bottom"],
        body.gpnr-modal-open [class*="floating"] {
          display: none !important;
        }
      `}</style>

      <header className="sticky top-0 z-[60] w-full bg-[#0d0f1d] border-b border-slate-800/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-[48px] items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-2">
              <span
                className="font-black text-xl tracking-wider text-purple-400 cursor-pointer select-none"
                onClick={() => onCategoryChange && onCategoryChange("top-news")}
              >
                GPNR
              </span>
            </div>

            {/* 우측 영역 */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDonation}
                type="button"
                className="flex items-center gap-1 bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30 hover:bg-purple-800/50 text-[11px] font-bold transition-colors"
              >
                <span>🪙</span>
                <span>0.01 Pi 후원</span>
              </button>

              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                type="button"
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700/50 flex items-center justify-center"
                aria-label="Toggle Menu"
              >
                <Menu className="w-5 h-5 text-slate-200" />
              </button>

              {displayId && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-900/60 rounded-full border border-purple-500/50 text-[11px] font-mono text-purple-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{displayId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 그리드 모달 - 사이즈 압축 및 레이아웃 슬림화 */}
      {isLauncherOpen && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsLauncherOpen(false)}
        >
          <div
            className="w-full max-w-[320px] bg-[#131528] border border-purple-500/30 rounded-2xl p-3 shadow-2xl relative max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLauncherOpen(false)}
              type="button"
              className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors p-1 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 4열 컴팩트 레이아웃 (사이즈 2/3 압축) */}
            <div className="grid grid-cols-4 gap-1.5 mt-5">
              {NEWS_CATEGORIES.map((category) => {
                const isSelected = currentCategory === category.id;
                const labelText =
                  currentLang === "ko"
                    ? category.name || category.label || category.id
                    : category.enName || category.enLabel || category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      if (onCategoryChange) onCategoryChange(category.id);
                      setIsLauncherOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-1 min-h-[52px] rounded-lg transition-all border ${
                      isSelected
                        ? "bg-[#2d1b4e] border-purple-500 text-white shadow-md shadow-purple-900/40 scale-105"
                        : "bg-[#1c1e36]/80 border-slate-800/80 text-slate-300 hover:bg-[#252846]"
                    }`}
                  >
                    {renderCategoryIcon(category)}
                    <span className="text-[9px] font-medium text-slate-200 text-center px-0.5 truncate w-full">
                      {labelText}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  if (onCategoryChange) onCategoryChange("calendar");
                  setIsLauncherOpen(false);
                }}
                className={`flex flex-col items-center justify-center p-1 min-h-[52px] rounded-lg transition-all border ${
                  currentCategory === "calendar"
                    ? "bg-[#2d1b4e] border-purple-500 text-white shadow-md shadow-purple-900/40 scale-105"
                    : "bg-[#1c1e36]/80 border-slate-800/80 text-slate-300 hover:bg-[#252846]"
                }`}
              >
                <Calendar className="w-4 h-4 mb-0.5 text-rose-400 shrink-0" />
                <span className="text-[9px] font-medium text-slate-200 text-center px-0.5 truncate w-full">
                  {currentLang === "ko" ? "달력" : "Calendar"}
                </span>
              </button>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("gpnr_kyc_id");
                    localStorage.removeItem("gpnr_wallet_address");
                  }
                  alert(
                    currentLang === "ko"
                      ? "KYC ID 인증 정보가 재설정되었습니다."
                      : "Reset KYC ID completed."
                  );
                  setIsLauncherOpen(false);
                }}
                className="w-full py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition-all text-center"
              >
                Reset KYC ID
              </button>

              {isAuthenticated && (
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>
                    연결된 ID/지갑:{" "}
                    <strong className="text-purple-300 font-mono">
                      {displayId}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsLauncherOpen(false);
                    }}
                    className="text-rose-400 hover:underline text-[10px]"
                  >
                    ID 변경
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GpnrHeader;
