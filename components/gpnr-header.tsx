// components/gpnr-header.tsx
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { NEWS_CATEGORIES } from "../lib/categories";
import { UsageModal, CommunityModal } from "./usage-modal";

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
  TrendingUp,
  DollarSign,
  Shield,
  Gavel,
  Calendar,
  Coins,
  Menu,
  X,
  Newspaper,
  HelpCircle,
  Cpu
} from "lucide-react";

// 아이콘 매핑 객체
const ICON_MAP: Record<string, React.ElementType> = {
  "top-news": Flame,
  "mainnet": Globe,
  "node": Tv,
  "mining": Zap,
  "wallet": Wallet,
  "browser": Compass,
  "roadmap": Map,
  "whitepaper": FileText,
  "commerce": ShoppingCart,
  "kyc": ShieldCheck,
  "developer": Code,
  "outlook": TrendingUp,
  "price": DollarSign,
  "rules": Gavel,
  "defi": Coins,
  "tech": Cpu,
  "security": Shield,
  "schedule": Calendar,
  "community": Users,
  "usage": HelpCircle,
};

const NEON_PALETTE = [
  { gradient: "linear-gradient(90deg, #c084fc 0%, #f472b6 50%, #fcd34d 100%)", glow: "0 0 14px rgba(192, 132, 252, 0.85)" },
  { gradient: "linear-gradient(90deg, #34d399 0%, #2dd4bf 50%, #22d3ee 100%)", glow: "0 0 14px rgba(52, 211, 153, 0.85)" },
  { gradient: "linear-gradient(90deg, #fcd34d 0%, #fb7185 50%, #c084fc 100%)", glow: "0 0 14px rgba(252, 211, 77, 0.85)" },
  { gradient: "linear-gradient(90deg, #60a5fa 0%, #a5b4fc 50%, #c084fc 100%)", glow: "0 0 14px rgba(96, 165, 250, 0.85)" },
  { gradient: "linear-gradient(90deg, #e879f9 0%, #c084fc 50%, #a5b4fc 100%)", glow: "0 0 14px rgba(232, 121, 249, 0.85)" }
];

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
  const [isUsageOpen, setIsUsageOpen] = useState<boolean>(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<string>("ko");
  const [colorIdx, setColorIdx] = useState<number>(0);

  const { user, logout } = usePiNetworkAuthentication();

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
    : "11177";

  const renderCategoryIcon = (categoryId: string) => {
    const FoundIcon = ICON_MAP[categoryId] || Newspaper;
    return <FoundIcon className="w-4 h-4 mb-0.5 text-purple-400 shrink-0" />;
  };

  const activeNeon = NEON_PALETTE[colorIdx];

  return (
    <>
      <header className="sticky top-0 z-[60] w-full bg-[#0d0f1d] border-b border-slate-800/80 backdrop-blur-xl notranslate" translate="no">
        <div className="mx-auto max-w-7xl px-3 notranslate" translate="no">
          <div className="flex h-[48px] items-center justify-between notranslate" translate="no">
            <div className="flex items-center gap-2 notranslate" translate="no">
              <span
                className="font-black text-2xl tracking-wider cursor-pointer select-none active:scale-95 transition-all duration-1000 ease-in-out notranslate"
                translate="no"
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

            <div className="flex items-center gap-2 notranslate" translate="no">
              {/* 상단 이용방법 버튼 */}
              <button
                onClick={() => setIsUsageOpen(true)}
                type="button"
                className="px-2 py-1 rounded-lg bg-purple-900/40 text-purple-300 hover:bg-purple-800/50 active:scale-95 transition-all border border-purple-700/50 flex items-center gap-1 text-[11px] font-medium cursor-pointer notranslate"
                translate="no"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
                <span className="notranslate" translate="no">이용방법</span>
              </button>

              {/* 런처 메뉴 버튼 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                type="button"
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-200 hover:bg-slate-700 active:scale-95 transition-all border border-slate-700/50 flex items-center justify-center cursor-pointer notranslate"
                translate="no"
              >
                <Menu className="w-5 h-5 text-slate-200" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 4열 그리드 런처 팝업 */}
      {isLauncherOpen && (
        <div
          className="notranslate"
          translate="no"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
          onClick={() => setIsLauncherOpen(false)}
        >
          <div
            className="notranslate"
            translate="no"
            style={{
              width: '90%',
              maxWidth: '340px',
              backgroundColor: '#131528',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '20px',
              padding: '14px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 헤더 */}
            <div className="notranslate" translate="no" style={{ display: 'flex', itemsAlign: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(30, 41, 59, 0.8)', paddingBottom: '8px', marginBottom: '12px' }}>
              <span className="notranslate" translate="no" style={{ fontSize: '13px', fontWeight: 'bold', color: '#f1f5f9' }}>카테고리 메뉴</span>
              <button
                onClick={() => setIsLauncherOpen(false)}
                type="button"
                className="notranslate"
                translate="no"
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4열 그리드 카테고리 버튼들 */}
            <div className="notranslate" translate="no" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px' }}>
              {NEWS_CATEGORIES.map((category) => {
                const isSelected = currentCategory === category.id;
                const labelText = currentLang === "ko" ? category.name : category.enName;

                return (
                  <button
                    key={category.id}
                    type="button"
                    className="notranslate"
                    translate="no"
                    onClick={() => {
                      if (category.id === 'usage') {
                        setIsLauncherOpen(false);
                        setIsUsageOpen(true);
                      } else if (category.id === 'community') {
                        setIsLauncherOpen(false);
                        setIsCommunityOpen(true);
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
                    {renderCategoryIcon(category.id)}
                    <span className="notranslate" translate="no" style={{ fontSize: '9px', fontWeight: 500, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {labelText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 하단 KYC 및 계정 정보 */}
            <div className="notranslate" translate="no" style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(30, 41, 59, 0.8)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="notranslate"
                translate="no"
                onClick={() => {
                  localStorage.removeItem("gpnr_kyc_id");
                  alert("KYC ID 정보가 재설정되었습니다.");
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(76, 5, 25, 0.6)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fca5a5',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                KYC ID 재설정
              </button>

              <div className="notranslate" translate="no" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', padding: '0 4px' }}>
                <span className="notranslate" translate="no">
                  연결: <strong className="notranslate" translate="no" style={{ color: '#c084fc' }}>{displayId}</strong>
                </span>
                <button
                  type="button"
                  className="notranslate"
                  translate="no"
                  onClick={() => {
                    if (logout) logout();
                    setIsLauncherOpen(false);
                  }}
                  style={{ color: '#fb7185', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  로그아웃/변경
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이용방법 모달 */}
      <UsageModal isOpen={isUsageOpen} onClose={() => setIsUsageOpen(false)} />

      {/* 커뮤니티 모달 */}
      <CommunityModal isOpen={isCommunityOpen} onClose={() => setIsCommunityOpen(false)} />
    </>
  );
}

export { GpnrHeader as Header, GpnrHeader };
export default GpnrHeader;
