// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { NEWS_CATEGORIES } from "../lib/categories";

// Lucide 아이콘 패키지 임포트 (Calendar 포함)
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
  Home,
  TrendingUp,
  DollarSign,
  Shield,
  Gavel,
  Calendar,
  Menu,
  X
} from "lucide-react";

// 아이콘 문자열 명칭을 실제 Lucide 컴포넌트로 연결하는 매핑 객체
const ICON_MAP: Record<string, React.ElementType> = {
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
  Home,
  TrendingUp,
  DollarSign,
  Shield,
  Gavel,
  Calendar,
};

interface HeaderProps {
  currentCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  currentLanguage?: string;
}

export function Header({
  currentCategory = "top-news",
  onCategoryChange,
  currentLanguage
}: HeaderProps) {
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
    ? user.username.length > 12
      ? `${user.username.substring(0, 5)}...${user.username.substring(user.username.length - 4)}`
      : user.username
    : "";

  return (
    <>
      {/* GPNR 상단 메인 헤더 */}
      <header className="sticky top-0 z-[60] w-full bg-[#0d0f1d] border-b border-slate-800/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-[48px] items-center justify-between">
            {/* 로고 영역 */}
            <div className="flex items-center gap-2">
              <span
                className="font-black text-xl tracking-wider text-purple-400 cursor-pointer select-none"
                onClick={() => onCategoryChange && onCategoryChange("top-news")}
              >
                GPNR
              </span>
            </div>

            {/* 우측 버튼 영역 (후원 + 삼선/그리드 메뉴 버튼) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDonation}
                type="button"
                className="flex items-center gap-1 bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30 hover:bg-purple-800/50 text-[11px] font-bold transition-colors"
              >
                <span>🪙</span>
                <span>0.01 Pi 후원</span>
              </button>

              {/* 삼선(햄버거) / 런처 모달 오픈 토글 버튼 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                type="button"
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700/50 flex items-center justify-center"
                aria-label="Toggle Menu"
              >
                <Menu className="w-5 h-5 text-slate-200" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 그리드 카테고리 풀 런처 모달 */}
      {isLauncherOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsLauncherOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#131528] border border-purple-500/30 rounded-3xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsLauncherOpen(false)}
              type="button"
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 3열 카테고리 그리드 (Icon 및 iconName 지원) */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {NEWS_CATEGORIES.map((category) => {
                const isSelected = currentCategory === category.id;

                // categories.ts의 Icon(대문자) 컴포넌트 객체 또는 iconName/icon 문자열 동적 대응
                const IconComponent =
                  category.Icon ||
                  (category.iconName ? ICON_MAP[category.iconName] : null) ||
                  (category.icon ? (typeof category.icon === "string" ? ICON_MAP[category.icon] : category.icon) : null) ||
                  Flame;

                // 라벨 텍스트
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
                    className={`flex flex-col items-center justify-center p-2 min-h-[88px] rounded-2xl transition-all border ${
                      isSelected
                        ? "bg-[#2d1b4e] border-purple-500 text-white shadow-lg shadow-purple-900/40"
                        : "bg-[#1c1e36]/80 border-slate-800/80 text-slate-300 hover:bg-[#252846]"
                    }`}
                  >
                    {/* Lucide SVG 아이콘 컴포넌트 */}
                    <IconComponent className="w-6 h-6 mb-1 text-purple-400 shrink-0" />
                    <span className="text-[11px] font-medium text-slate-200 text-center px-1 truncate w-full">
                      {labelText}
                    </span>
                  </button>
                );
              })}

              {/* 달력(Calendar) 추가 항목 대응 */}
              <button
                type="button"
                onClick={() => {
                  if (onCategoryChange) onCategoryChange("calendar");
                  setIsLauncherOpen(false);
                }}
                className={`flex flex-col items-center justify-center p-2 min-h-[88px] rounded-2xl transition-all border ${
                  currentCategory === "calendar"
                    ? "bg-[#2d1b4e] border-purple-500 text-white shadow-lg shadow-purple-900/40"
                    : "bg-[#1c1e36]/80 border-slate-800/80 text-slate-300 hover:bg-[#252846]"
                }`}
              >
                <Calendar className="w-6 h-6 mb-1 text-rose-400 shrink-0" />
                <span className="text-[11px] font-medium text-slate-200 text-center px-1 truncate w-full">
                  {currentLang === "ko" ? "달력" : "Calendar"}
                </span>
              </button>
            </div>

            {/* 하단 계정 정보 및 Reset KYC ID / ID 변경 영역 */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("pi_user_id");
                    localStorage.removeItem("pi_user_auth");
                  }
                  alert(
                    currentLang === "ko"
                      ? "KYC ID 인증 정보가 재설정되었습니다."
                      : "Reset KYC ID completed."
                  );
                  setIsLauncherOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all text-center"
              >
                Reset KYC ID
              </button>

              {isAuthenticated && (
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                  <span>
                    연결된 ID:{" "}
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
                    className="text-rose-400 hover:underline text-[11px]"
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

export default Header;
