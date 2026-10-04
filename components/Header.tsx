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
  Gavel,
  Calendar,
  Coins,
  Menu,
  X,
  Newspaper,
  HelpCircle,
  CheckCircle2
} from "lucide-react";

// GPNR 로고용 카멜레온 네온 그라데이션 색상 팔레트
const CHAMELEON_COLORS = [
  "from-purple-400 via-pink-400 to-amber-300",
  "from-emerald-400 via-teal-300 to-cyan-400",
  "from-amber-300 via-rose-400 to-purple-400",
  "from-blue-400 via-indigo-300 to-purple-400",
  "from-fuchsia-400 via-purple-400 to-indigo-300",
  "from-cyan-400 via-sky-300 to-blue-500",
];

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
  "legal": Gavel,
  "regulations": Gavel,
  "calendar": Calendar,
  "defi": Coins,
};

// GPNR 앱 이용방법 안내 문구 데이터 (8가지)
const USAGE_GUIDE_KO = [
  {
    title: "무료 이용 및 자율 후원",
    desc: "GPNR 앱은 모든 파이오니어 분들이 무료로 이용 가능합니다. 후원은 자율이며, 상단 '0.01 파이 기부' 버튼을 통해 1회당 0.01 Pi씩 후원하실 수 있습니다.",
  },
  {
    title: "실시간 최신 주요 뉴스 제공",
    desc: "Web2 및 Web3의 Pi 관련 공신력 있는 매체의 뉴스를 실시간으로 수집하여 제공하며, 최신 소식을 최상단에 배치합니다.",
  },
  {
    title: "카테고리별 뉴스 탐색",
    desc: "상단 카테고리 바(Top News, Mainnet, Node, Mining 등)를 터치하거나 좌우 화살표(<, >) 버튼을 이용해 다양한 주제로 빠르게 이동할 수 있습니다.",
  },
  {
    title: "Pi 네트워크 지갑 연동 상태 확인 및 변경",
    desc: "상단 및 뉴스 리스트 위에 현재 연결된 Pi 네트워크 지갑(ID) 상태가 표시되며, 우측 'ID 변경' 버튼을 눌러 연동 지갑을 재설정하실 수 있습니다.",
  },
  {
    title: "다국어 (한국어 / 영어) 지원",
    desc: "화면 우측 하단의 언어 선택 드롭다운 메뉴(한국어, 영어)를 통해 원하시는 언어로 뉴스를 손쉽게 전환하여 읽으실 수 있습니다.",
  },
  {
    title: "실시간 핫이슈 티커",
    desc: "상단 헤더 아래의 티커 릴을 통해 실시간으로 업데이트되는 Pi Network 주요 핫이슈 및 긴급 소식을 빠르게 확인하실 수 있습니다.",
  },
  {
    title: "전체 메뉴 Navigation 런처",
    desc: "우측 상단 햄버거 메뉴(≡) 버튼을 누르면 GPNR 전체 카테고리 런처 모달이 열려 원하시는 항목으로 즉시 이동이 가능합니다.",
  },
  {
    title: "원문 뉴스 출처 확인 및 반응",
    desc: "각 기사 카드 하단에서 해당 뉴스의 출처 매체명과 발행일을 확인할 수 있으며, 관심 있는 기사에 반응을 남기실 수 있습니다.",
  },
];

const USAGE_GUIDE_EN = [
  {
    title: "Free Access & Voluntary Donation",
    desc: "GPNR app is free for all Pioneers. Donations are voluntary (0.01 Pi per transaction via top donation button).",
  },
  {
    title: "Real-time Major Pi News",
    desc: "Collects real-time verified Pi news from Web2 and Web3, placing the latest updates at the top.",
  },
  {
    title: "Category News Navigation",
    desc: "Tap the top category bar or use left/right arrows (<, >) to easily navigate across different topics.",
  },
  {
    title: "Pi Wallet Connection Status & Change",
    desc: "View your connected Pi account/ID status. Click 'Change ID' to reset or switch connected wallets.",
  },
  {
    title: "Multilingual Support (Korean / English)",
    desc: "Easily switch news languages using the bottom-right language floating selector.",
  },
  {
    title: "Real-time Hot Issue Ticker",
    desc: "Check real-time breaking news and hot issues through the sub-header ticker bar.",
  },
  {
    title: "Full Navigation Launcher",
    desc: "Tap the top-right menu button (≡) to open the 4-column category grid for instant navigation.",
  },
  {
    title: "Source Verification & News Interactions",
    desc: "Check news source domains, publication dates, and interact with articles directly.",
  },
];

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
  const [isUsageModalOpen, setIsUsageModalOpen] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<string>("ko");
  const [logoColorIdx, setLogoColorIdx] = useState<number>(0);

  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();

  // GPNR 로고 카멜레온 색상 전환 타이머 (2.5초 간격)
  useEffect(() => {
    const colorTimer = setInterval(() => {
      setLogoColorIdx((prev) => (prev + 1) % CHAMELEON_COLORS.length);
    }, 2500);

    return () => clearInterval(colorTimer);
  }, []);

  // 언어 동기화
  const syncLanguage = useCallback(() => {
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
  }, [currentLanguage]);

  useEffect(() => {
    setMounted(true);
    syncLanguage();

    window.addEventListener("storage", syncLanguage);
    window.addEventListener("languageChange", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener("languageChange", syncLanguage);
    };
  }, [syncLanguage]);

  // 모달 제어 시 배경 스크롤 방지 및 ESC 키 처리
  useEffect(() => {
    if (!isLauncherOpen && !isUsageModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLauncherOpen(false);
        setIsUsageModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLauncherOpen, isUsageModalOpen]);

  // 0.01 Pi 후원 결제
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

  // 파이 지갑/ID 축약 표시
  const displayId = user?.username
    ? user.username.length > 12
      ? `${user.username.substring(0, 5)}...${user.username.substring(user.username.length - 4)}`
      : user.username
    : "";

  // 카테고리 아이콘 렌더링 함수
  const renderCategoryIcon = (category: any) => {
    const rawId = category.id ? String(category.id).toLowerCase() : "";
    const normalizedId = rawId.replace(/_/g, "-");

    const FoundIcon =
      ICON_MAP[rawId] ||
      ICON_MAP[normalizedId] ||
      (category.name && ICON_MAP[category.name.toLowerCase()]) ||
      (category.enName && ICON_MAP[category.enName.toLowerCase()]) ||
      (category.iconName && ICON_MAP[category.iconName.toLowerCase()]) ||
      (typeof category.icon === "string" && ICON_MAP[category.icon.toLowerCase()]);

    if (FoundIcon) {
      return <FoundIcon className="w-4 h-4 mb-0.5 text-purple-400 shrink-0" />;
    }

    if (typeof category.icon === "function" || typeof category.Icon === "function") {
      const CustomIcon = category.icon || category.Icon;
      return <CustomIcon className="w-4 h-4 mb-0.5 text-purple-400 shrink-0" />;
    }

    if (typeof category.icon === "string" && (category.icon.startsWith("http") || category.icon.startsWith("/"))) {
      return <img src={category.icon} alt={category.name || category.id} className="w-4 h-4 mb-0.5 object-contain shrink-0" />;
    }

    return <Newspaper className="w-4 h-4 mb-0.5 text-purple-400 shrink-0" />;
  };

  const usageGuideList = currentLang === "ko" ? USAGE_GUIDE_KO : USAGE_GUIDE_EN;

  return (
    <>
      <header className="sticky top-0 z-[60] w-full bg-[#0d0f1d] border-b border-slate-800/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-[48px] items-center justify-between">
            {/* 카멜레온 로고 영역 */}
            <div className="flex items-center gap-2">
              <span
                className={`font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${CHAMELEON_COLORS[logoColorIdx]} transition-all duration-1000 ease-in-out cursor-pointer select-none filter drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]`}
                onClick={() => onCategoryChange && onCategoryChange("top-news")}
              >
                GPNR
              </span>
            </div>

            {/* 우측 영역 (후원 + 지갑 ID + 이용방법 + 메뉴) */}
            <div className="flex items-center gap-2">
              {/* 후원 버튼 */}
              <button
                onClick={handleDonation}
                type="button"
                className="flex items-center gap-1 bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30 hover:bg-purple-800/50 text-[11px] font-bold transition-colors active:scale-95"
              >
                <span>🪙</span>
                <span>0.01 Pi</span>
              </button>

              {/* 지갑/ID 표시 */}
              {displayId && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/60 rounded-full border border-purple-500/40 text-[11px] font-mono text-purple-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{displayId}</span>
                </div>
              )}

              {/* 이용방법 안내 버튼 */}
              <button
                onClick={() => setIsUsageModalOpen(true)}
                type="button"
                className="p-1.5 rounded-xl bg-slate-800/80 text-purple-300 hover:bg-slate-700 transition-all border border-purple-500/30 flex items-center justify-center active:scale-95"
                title={currentLang === "ko" ? "이용방법 안내" : "Usage Guide"}
                aria-label="Usage Guide"
              >
                <HelpCircle className="w-5 h-5 text-purple-400" />
              </button>

              {/* 전체 메뉴 토글 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                type="button"
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700/50 flex items-center justify-center active:scale-95"
                aria-label="Toggle Menu"
              >
                <Menu className="w-5 h-5 text-slate-200" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 런처 메뉴 모달 */}
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
              maxWidth: '340px',
              maxHeight: '82vh',
              overflowY: 'auto',
              backgroundColor: '#131528',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '20px',
              padding: '14px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-bold text-purple-300">GPNR Navigation</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLauncherOpen(false);
                    setIsUsageModalOpen(true);
                  }}
                  className="text-[11px] text-purple-300 flex items-center gap-1 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/30"
                >
                  <HelpCircle className="w-3 h-3 text-purple-400" />
                  <span>{currentLang === "ko" ? "이용방법" : "Guide"}</span>
                </button>
                <button
                  onClick={() => setIsLauncherOpen(false)}
                  type="button"
                  style={{
                    color: '#94a3b8',
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer'
                  }}
                  aria-label="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4열 그리드 카테고리 매핑 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '6px',
                marginTop: '10px'
              }}
            >
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
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 4px',
                      minHeight: '52px',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid #a855f7' : '1px solid rgba(30, 41, 59, 0.8)',
                      backgroundColor: isSelected ? '#2d1b4e' : 'rgba(28, 30, 54, 0.8)',
                      color: isSelected ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {renderCategoryIcon(category)}
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 500,
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        marginTop: '2px'
                      }}
                    >
                      {labelText}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(30, 41, 59, 0.8)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                style={{
                  width: '100%',
                  padding: '8px 0',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(76, 5, 25, 0.4)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fda4af',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {currentLang === "ko" ? "KYC ID 재설정" : "Reset KYC ID"}
              </button>

              {isAuthenticated && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: '#94a3b8', padding: '0 4px' }}>
                  <span>
                    {currentLang === "ko" ? "연결된 ID/지갑: " : "Connected ID/Wallet: "}
                    <strong style={{ color: '#d8b4fe', fontFamily: 'monospace' }}>
                      {displayId}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsLauncherOpen(false);
                    }}
                    style={{ color: '#fb7185', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '10.5px' }}
                  >
                    {currentLang === "ko" ? "아이디 변경" : "Change ID"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GPNR 앱 이용방법 모달 (8가지 팝업) */}
      {isUsageModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px'
          }}
          onClick={() => setIsUsageModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              maxHeight: '85vh',
              overflowY: 'auto',
              backgroundColor: '#111326',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '20px',
              padding: '18px',
              boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 타이틀 바 */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-slate-100">
                  {currentLang === "ko" ? "GPNR 앱 이용방법" : "GPNR App Guide"}
                </span>
              </div>
              <button
                onClick={() => setIsUsageModalOpen(false)}
                type="button"
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                aria-label="Close Guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 이용방법 안내 리스트 (8가지) */}
            <div className="flex flex-col gap-3.5">
              {usageGuideList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80"
                >
                  <div className="shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-purple-200">
                      {idx + 1}. {item.title}
                    </span>
                    <span className="text-[11px] text-slate-300 leading-relaxed">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 닫기 버튼 */}
            <div className="mt-5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsUsageModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg shadow-purple-900/40"
              >
                {currentLang === "ko" ? "확인 및 닫기" : "Confirm & Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// named export 및 default export 모두 지원
export { Header as GpnrHeader };
export default Header;
