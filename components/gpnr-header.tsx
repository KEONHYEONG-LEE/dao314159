// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { NEWS_CATEGORIES } from "../lib/categories";
import { UsageModal } from "./usage-modal";

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
  Gavel,
  Calendar,
  Coins,
  Menu,
  X,
  Newspaper,
  Loader2,
  HelpCircle
} from "lucide-react";

const NEON_PALETTE = [
  { gradient: "linear-gradient(90deg, #c084fc 0%, #f472b6 50%, #fcd34d 100%)", glow: "0 0 14px rgba(192, 132, 252, 0.85)" },
  { gradient: "linear-gradient(90deg, #34d399 0%, #2dd4bf 50%, #22d3ee 100%)", glow: "0 0 14px rgba(52, 211, 153, 0.85)" },
  { gradient: "linear-gradient(90deg, #fcd34d 0%, #fb7185 50%, #c084fc 100%)", glow: "0 0 14px rgba(252, 211, 77, 0.85)" },
  { gradient: "linear-gradient(90deg, #60a5fa 0%, #a5b4fc 50%, #c084fc 100%)", glow: "0 0 14px rgba(96, 165, 250, 0.85)" },
  { gradient: "linear-gradient(90deg, #e879f9 0%, #c084fc 50%, #a5b4fc 100%)", glow: "0 0 14px rgba(232, 121, 249, 0.85)" }
];

const ICON_MAP: Record<string, React.ElementType> = {
  "top-news": Flame,
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
  "calendar": Calendar,
  "schedule": Calendar,
  "outlook": TrendingUp,
  "price": DollarSign,
  "security": Shield,
  "legal": Gavel,
  "defi": Coins,
  "usage": HelpCircle,
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
  const [isUsageOpen, setIsUsageOpen] = useState<boolean>(false); // 이용방법 팝업 상태
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<string>("ko");
  const [colorIdx, setColorIdx] = useState<number>(0);

  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();

  useEffect(() => {
    const timer = setInterval(() => {
      setColorIdx((prev) => (prev + 1) % NEON_PALETTE.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
    const syncLanguage = () => {
      try {
        if (typeof window !== "undefined") {
          const targetLang =
            currentLanguage ||
            localStorage.getItem("gpnr_lang") ||
            localStorage.getItem("language") ||
            "ko";
          setCurrentLang(targetLang);
        }
      } catch (e) {
        console.error("Language sync error:", e);
      }
    };
    syncLanguage();
  }, [currentLanguage]);

  if (!mounted) return null;

  const displayId = user?.username
    ? user.username.length > 10
      ? `${user.username.substring(0, 4)}...${user.username.substring(user.username.length - 4)}`
      : user.username
    : "";

  const renderCategoryIcon = (category: any) => {
    const FoundIcon = ICON_MAP[category.id] || category.Icon || Newspaper;
    return <FoundIcon className="w-4 h-4 mb-0.5 text-purple-400 shrink-0" />;
  };

  const activeNeon = NEON_PALETTE[colorIdx];

  return (
    <>
      <header className="sticky top-0 z-[60] w-full bg-[#0d0f1d] border-b border-slate-800/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-[48px] items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="font-black text-2xl tracking-wider cursor-pointer select-none active:scale-95 transition-all duration-1000 ease-in-out"
                style={{
                  backgroundImage: activeNeon.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(${activeNeon.glow})`,
                }}
                onClick={() => onCategoryChange && onCategoryChange("top-news")}
              >
                GPNR
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                type="button"
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-200 hover:bg-slate-700 active:scale-95 transition-all border border-slate-700/50 flex items-center justify-center cursor-pointer"
              >
                <Menu className="w-5 h-5 text-slate-200" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 4열 그리드 런처 모달 */}
      {isLauncherOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
          onClick={() => setIsLauncherOpen(false)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '320px',
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: '#131528',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '20px',
              padding: '14px',
              paddingBottom: '20px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLauncherOpen(false)}
              type="button"
              style={{ position: 'absolute', top: '10px', right: '10px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* 카테고리 4열 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px', marginTop: '16px' }}>
              {NEWS_CATEGORIES.map((category) => {
                const isSelected = currentCategory === category.id;
                const labelText = currentLang === "ko" ? category.name : category.enName;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      if (category.id === 'usage') {
                        setIsLauncherOpen(false);
                        setIsUsageOpen(true); // 이용방법 클릭 시 모달 팝업 열기
                      } else {
                        if (onCategoryChange) onCategoryChange(category.id);
                        setIsLauncherOpen(false);
                      }
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 2px',
                      minHeight: '52px',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid #a855f7' : '1px solid rgba(30, 41, 59, 0.8)',
                      backgroundColor: isSelected ? '#2d1b4e' : 'rgba(28, 30, 54, 0.8)',
                      color: isSelected ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    {renderCategoryIcon(category)}
                    <span style={{ fontSize: '9px', fontWeight: 500, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {labelText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 이용방법 별도 팝업창 */}
      <UsageModal
        isOpen={isUsageOpen}
        onClose={() => setIsUsageOpen(false)}
        lang={currentLang}
      />
    </>
  );
}

export { GpnrHeader as Header, GpnrHeader };
export default GpnrHeader;
