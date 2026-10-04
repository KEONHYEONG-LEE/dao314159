// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
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
  X,
  Newspaper,
  HelpCircle,
  CheckCircle2
} from "lucide-react";

// 아이콘 매핑
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

// 이용방법 8가지 안내문 데이터
const USAGE_GUIDE_KO = [
  {
    title: "무료 이용 및 자율 후원",
    desc: "GPNR app은 파이오니어 누구나 무료로 이용 가능하다. 후원은 자율이며 한번에 0.01pi만 가능합니다.",
  },
  {
    title: "실시간 최신 주요 뉴스 제공",
    desc: "Web2, web3의 Pi 관련 공신력 있는 싸이트의 실시간 주요 뉴스를 각 주제별로 제공하며, 최신 소식을 제일 최상단으로 배치했습니다.",
  },
  {
    title: "카테고리 스크롤 및 빠른 이동",
    desc: "상단 카테고리 바(Top News, Mainnet, Node 등)를 터치하거나 좌우 화살표(<, >)를 눌러 주제별 뉴스를 빠르게 전환할 수 있습니다.",
  },
  {
    title: "Pi 네트워크 지갑 연결 및 ID 설정",
    desc: "현재 연결된 지갑/ID 상태가 상단 및 하단에 표시되며, 계정 변경 시 '로그아웃/변경' 버튼으로 재설정할 수 있습니다.",
  },
  {
    title: "실시간 핫이슈 티커 바",
    desc: "헤더 하단의 티커 릴을 통해 Pi Network의 핵심 뉴스 및 실시간 마이그레이션 핫이슈를 바로 확인할 수 있습니다.",
  },
  {
    title: "다국어 (한국어 / 영어) 즉시 번역 지원",
    desc: "우측 하단의 언어 선택 플로팅 버튼(한국어/영어 드롭다운)을 눌러 원하시는 언어로 뉴스를 손쉽게 전환하여 읽으실 수 있습니다.",
  },
  {
    title: "전체 항목 Navigation 런처",
    desc: "우측 상단 햄버거 메뉴(≡)를 누르면 전체 카테고리 런처 모달이 열려 원하는 메뉴로 즉시 이동할 수 있습니다.",
  },
  {
    title: "원문 뉴스 출처 확인 및 스크랩/반응",
    desc: "각 기사의 출처 매체 및 발행일을 확인하고, 관심 있는 뉴스에 스크랩 및 반응을 남기실 수 있습니다.",
  },
];

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCategory?: string;
  onSelectCategory?: (id: string) => void;
  connectedWallet?: string;
  onResetKyc?: () => void;
  onLogout?: () => void;
}

export default function NavigationModal({
  isOpen,
  onClose,
  currentCategory = "top-news",
  onSelectCategory,
  connectedWallet,
  onResetKyc,
  onLogout,
}: NavigationModalProps) {
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showHelpModal) {
          setShowHelpModal(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showHelpModal, onClose]);

  if (!isOpen) return null;

  // 지갑 주소 축약 (예: GAC7...BBUQ)
  const displayWallet = connectedWallet
    ? connectedWallet.length > 12
      ? `${connectedWallet.substring(0, 4)}...${connectedWallet.substring(connectedWallet.length - 4)}`
      : connectedWallet
    : "GAC7...BBUQ";

  const renderIcon = (category: any) => {
    const rawId = category.id ? String(category.id).toLowerCase() : "";
    const FoundIcon = ICON_MAP[rawId] || Newspaper;
    return <FoundIcon className="w-5 h-5 mb-1 text-purple-400 shrink-0" />;
  };

  return (
    <>
      {/* 1. 카테고리 메뉴 팝업 (기존 디자인 100% 동일 유지) */}
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[340px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[#131528] border border-purple-500/30 p-4 shadow-2xl flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 닫기 & 이용방법 상단 바 */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:bg-purple-900/80 transition-colors text-[11px] font-bold"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>이용방법</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 카테고리 4열 그리드 (기존 레이아웃 재배열 유지) */}
          <div className="grid grid-cols-4 gap-2 py-1">
            {NEWS_CATEGORIES.map((cat) => {
              const isSelected = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat.id);
                    onClose();
                  }}
                  className={`flex flex-col items-center justify-center min-h-[58px] p-1.5 rounded-xl border text-[11px] transition-all active:scale-95 ${
                    isSelected
                      ? "bg-purple-950/90 border-purple-500 text-white font-bold shadow-lg shadow-purple-900/30"
                      : "bg-[#1c1e36]/80 border-slate-800/80 text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  {renderIcon(cat)}
                  <span className="truncate w-full text-center">
                    {cat.name || cat.label || cat.id}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 하단 KYC 및 계정 정보 (기존 화면 원본 스타일 동일) */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                if (onResetKyc) {
                  onResetKyc();
                } else {
                  localStorage.removeItem("gpnr_kyc_id");
                  alert("KYC ID 정보가 재설정되었습니다.");
                }
              }}
              className="w-full py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-bold hover:bg-rose-900/60 transition-colors"
            >
              KYC ID 포함
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              <span>
                연결: <strong className="font-mono text-purple-300">{displayWallet}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (onLogout) onLogout();
                  onClose();
                }}
                className="text-rose-400 hover:underline cursor-pointer"
              >
                로그아웃/변경
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 이용방법 팝업 모달 (상단 이용방법 버튼 클릭 시 독립 실행) */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="relative w-full max-w-[360px] max-h-[80vh] overflow-y-auto rounded-2xl bg-[#111326] border border-purple-500/40 p-4 shadow-2xl flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-slate-100">GPNR 앱 이용방법</span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                type="button"
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 안내문 리스트 */}
            <div className="flex flex-col gap-2.5">
              {USAGE_GUIDE_KO.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
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

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg shadow-purple-900/40"
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
