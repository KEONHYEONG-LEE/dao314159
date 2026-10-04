// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  MessageCircle,
  Share2,
  ExternalLink
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
  "outlook": TrendingUp,
  "price": DollarSign,
  "security": Shield,
  "legal": Gavel,
  "schedule": Calendar,
  "defi": Coins,
  "usage": HelpCircle,
};

const USAGE_GUIDE_KO = [
  { title: "무료 이용 및 자율 후원", desc: "GPNR app은 파이오니어 누구나 무료로 이용 가능합니다. 후원은 자율이며 한번에 0.01pi만 가능합니다." },
  { title: "실시간 최신 주요 뉴스 제공", desc: "Web2, web3의 Pi 관련 공신력 있는 싸이트의 실시간 주요 뉴스를 각 주제별로 제공하며, 최신 소식을 제일 최상단으로 배치했습니다." },
  { title: "보안, 일정 및 커뮤니티 통합 모니터링", desc: "네트워크 보안 가이드라인, 마이그레이션 일정 및 글로벌 파이오니어 커뮤니티 채널을 한눈에 파악하고 접근할 수 있습니다." },
  { title: "주제별 카테고리 퀵 선택", desc: "상단 메뉴 런처(4열 그리드)를 통하여 메인넷, 노드, 채굴, 지갑, 백서, 커머스 등 원하시는 주제로 즉시 이동이 가능합니다." },
  { title: "Pi 네트워크 지갑 및 ID 상태 연동", desc: "현재 연결된 파이오니어 계정 및 지갑 ID가 상단/하단에 실시간 연동되며, 필요 시 '로그아웃/변경'을 통해 손쉽게 관리합니다." },
  { title: "다국어 (한국어 / 영어) 즉시 번역 지원", desc: "글로벌 뉴스 및 가이드를 한글 및 영문으로 원클릭 전환하여 글로벌 소식을 지연 없이 확인하실 수 있습니다." },
  { title: "실시간 핫이슈 티커 바", desc: "상단 헤더 하단의 티커 릴을 통해 Pi 생태계 주요 변동사항 및 마이그레이션 이슈를 빠르게 체크할 수 있습니다." },
  { title: "KYC 인증 ID 관리 기능", desc: "하단 'KYC ID 포함' 버튼을 클릭하여 파이오니어 본인 인증 상태 및 ID 보존 설정을 간편하게 재설정할 수 있습니다." },
  { title: "파이오니어 커뮤니티 연결 모달", desc: "텔레그램, 디스코드, 공식 포럼 등 미려한 디자인의 커뮤니티 카드를 통해 세계 곳곳의 파이오니어들과 소통할 수 있습니다." },
  { title: "안전한 Web3 환경 최적화", desc: "비밀구절이나 개인키를 절대 요청하지 않으며, 안심하고 사용할 수 있는 안전한 웹3 환경을 최우선으로 제공합니다." }
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

  const renderCategoryIcon = (category: any) => {
    const rawId = category.id ? String(category.id).toLowerCase() : "";
    const FoundIcon = ICON_MAP[rawId] || category.Icon || Newspaper;
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

      {/* 4열 그리드 모달 (순서: 보안 -> 일정 -> 커뮤니티 -> 이용방법 고정) */}
      {isLauncherOpen && (
        <div
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
            style={{
              width: '90%',
              maxWidth: '340px',
              maxHeight: '82vh',
              overflowY: 'auto',
              backgroundColor: '#131528',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '20px',
              padding: '14px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 닫기 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', borderBottom: '1px solid rgba(30, 41, 59, 0.8)', paddingBottom: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f1f5f9' }}>카테고리 메뉴</span>
              <button
                onClick={() => setIsLauncherOpen(false)}
                type="button"
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 카테고리 4열 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px' }}>
              {NEWS_CATEGORIES.map((category) => {
                const isSelected = currentCategory === category.id;
                const labelText = currentLang === "ko" ? category.name : (category.enName || category.name);

                return (
                  <button
                    key={category.id}
                    type="button"
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
                    {renderCategoryIcon(category)}
                    <span style={{ fontSize: '9px', fontWeight: 500, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {labelText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 하단 KYC 및 연결 정보 */}
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(30, 41, 59, 0.8)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', padding: '0 4px' }}>
                <span>
                  연결: <strong style={{ color: '#c084fc' }}>{displayId}</strong>
                </span>
                <button
                  type="button"
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

      {/* 이용방법 10가지 가이드 팝업 모달 */}
      {isUsageOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1000000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
          onClick={() => setIsUsageOpen(false)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '350px',
              maxHeight: '82vh',
              overflowY: 'auto',
              backgroundColor: '#111326',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle className="w-5 h-5 text-purple-400" />
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc' }}>GPNR 앱 이용방법</span>
              </div>
              <button onClick={() => setIsUsageOpen(false)} type="button" style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {USAGE_GUIDE_KO.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(30, 41, 59, 0.8)' }}>
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" style={{ marginTop: '2px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e9d5ff' }}>{idx + 1}. {item.title}</span>
                    <span style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsUsageOpen(false)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #9333ea, #db2777)',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '12px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      )}

      {/* 커뮤니티 카드 모달 */}
      {isCommunityOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1000000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
          onClick={() => setIsCommunityOpen(false)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '340px',
              backgroundColor: '#131528',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users className="w-5 h-5 text-purple-400" />
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>파이오니어 커뮤니티</span>
              </div>
              <button onClick={() => setIsCommunityOpen(false)} type="button" style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: "공식 파이오니어 포럼", desc: "글로벌 생태계 소식 & 토론", icon: MessageCircle },
                { title: "GPNR 글로벌 오픈채팅", desc: "실시간 정보 공유 및 소통", icon: Share2 },
                { title: "파이 노드 기술 채널", desc: "노드 설정 및 기술 지원", icon: Code }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(58, 23, 92, 0.3)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <item.icon className="w-4 h-4 text-purple-300" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e2e8f0' }}>{item.title}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.desc}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsCommunityOpen(false)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '10px',
                backgroundColor: '#1e293b',
                color: '#cbd5e1',
                fontSize: '12px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export { GpnrHeader as Header, GpnrHeader };
export default GpnrHeader;
