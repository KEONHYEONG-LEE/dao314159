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
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Share2
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
  "schedule": Calendar,
  "defi": Coins,
  "usage": HelpCircle,
};

// 이용방법 10가지 가이드 데이터 (요청 2개 반영 + 앱 기능 기반 8개 자동 구성)
const USAGE_GUIDE_KO = [
  {
    title: "무료 이용 및 자율 후원",
    desc: "GPNR app은 파이오니어 누구나 무료로 이용 가능합니다. 후원은 자율이며 한번에 0.01pi만 가능합니다.",
  },
  {
    title: "실시간 최신 주요 뉴스 제공",
    desc: "Web2, web3의 Pi 관련 공신력 있는 싸이트의 실시간 주요 뉴스를 각 주제별로 제공하며, 최신 소식을 제일 최상단으로 배치했습니다.",
  },
  {
    title: "보안, 일정 및 커뮤니티 통합 모니터링",
    desc: "네트워크 보안 가이드라인, 마이그레이션 일정 및 글로벌 파이오니어 커뮤니티 채널을 한눈에 파악하고 접근할 수 있습니다.",
  },
  {
    title: "주제별 카테고리 퀵 선택",
    desc: "상단 메뉴 런처(4열 그리드)를 통하여 메인넷, 노드, 채굴, 지갑, 백서, 커머스 등 원하시는 주제로 즉시 이동이 가능합니다.",
  },
  {
    title: "Pi 네트워크 지갑 및 ID 상태 연동",
    desc: "현재 연결된 파이오니어 계정 및 지갑 ID가 상단/하단에 실시간 연동되며, 필요 시 '로그아웃/변경'을 통해 손쉽게 관리합니다.",
  },
  {
    title: "다국어 (한국어 / 영어) 즉시 번역 지원",
    desc: "글로벌 뉴스 및 가이드를 한글 및 영문으로 원클릭 전환하여 글로벌 소식을 지연 없이 확인하실 수 있습니다.",
  },
  {
    title: "실시간 핫이슈 티커 바",
    desc: "상단 헤더 하단의 티커 릴을 통해 Pi 생태계 주요 변동사항 및 마이그레이션 이슈를 빠르게 체크할 수 있습니다.",
  },
  {
    title: "KYC 인증 ID 관리 기능",
    desc: "하단 'KYC ID 포함' 버튼을 클릭하여 파이오니어 본인 인증 상태 및 ID 보존 설정을 간편하게 재설정할 수 있습니다.",
  },
  {
    title: "파이오니어 커뮤니티 연결 모달",
    desc: "텔레그램, 디스코드, 공식 포럼 등 미려한 디자인의 커뮤니티 카드를 통해 세계 곳곳의 파이오니어들과 소통할 수 있습니다.",
  },
  {
    title: "안전한 Web3 환경 최적화",
    desc: "비밀구절이나 개인키를 절대 요청하지 않으며, 안심하고 사용할 수 있는 안전한 웹3 환경을 최우선으로 제공합니다.",
  },
];

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

export function UsageModal({ isOpen, onClose }: UsageModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px] max-h-[82vh] overflow-y-auto rounded-2xl bg-[#111326] border border-purple-500/40 p-4 shadow-2xl flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-bold text-slate-100">GPNR 앱 이용방법</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 안내문 10가지 리스트 */}
        <div className="flex flex-col gap-2.5 my-1">
          {USAGE_GUIDE_KO.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/30 transition-all"
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
          onClick={onClose}
          className="w-full mt-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs transition-colors shadow-lg shadow-purple-900/40"
        >
          확인 및 닫기
        </button>
      </div>
    </div>
  );
}

// 2-2. 신규 미려한 커뮤니티 팝업 모달
export function CommunityModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const communityLinks = [
    { title: "공식 파이오니어 포럼", desc: "글로벌 생태계 소식 & 토론", icon: MessageCircle, badge: "Official" },
    { title: "GPNR 글로벌 오픈채팅", desc: "실시간 정보 공유 및 소통", icon: Share2, badge: "Community" },
    { title: "파이 노드 기술 채널", desc: "노드 설정 및 기술 지원", icon: Code, badge: "Tech" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[340px] rounded-2xl bg-[#131528] border border-purple-500/50 p-4 shadow-2xl flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-bold text-white">파이오니어 커뮤니티</span>
          </div>
          <button onClick={onClose} type="button" className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 my-1">
          {communityLinks.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400/70 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-900/50 text-purple-300 group-hover:scale-105 transition-transform">
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300" />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs hover:bg-slate-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default UsageModal;
