// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import {
  Users,
  Shield,
  X,
  HelpCircle,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Share2,
  Globe2,
  Bot
} from "lucide-react";

// 이용방법 10가지 가이드 데이터
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
    title: "4열 그리드 퀵 카테고리 런처",
    desc: "드롭다운 메뉴를 통해 주요뉴스, 메인넷, 노드, 지갑, 커머스 등 16개 핵심 주제로 원클릭 즉시 이동이 가능합니다.",
  },
  {
    title: "글로벌 다국어 (한국어 / 영어) 지원",
    desc: "글로벌 뉴스 및 가이드를 한국어 및 영문으로 원클릭 전환하여 시차 없이 실시간으로 소식을 확인하실 수 있습니다.",
  },
  {
    title: "보안, 일정 및 커뮤니티 통합 모니터링",
    desc: "메뉴 하단에서 네트워크 보안 수칙, 마이그레이션 일정, 글로벌 파이오니어 커뮤니티 채널을 한눈에 파악할 수 있습니다.",
  },
  {
    title: "파이오니어 계정 및 ID 상태 연동",
    desc: "현재 연결된 파이오니어 계정 및 지갑 ID가 실시간 연동되며, 필요 시 계정 변경 및 재설정이 손쉽게 가능합니다.",
  },
  {
    title: "실시간 핫이슈 뉴스 티커 바",
    desc: "헤더 하단 티커 릴을 통해 Pi 생태계 핵심 속보와 마이그레이션 주요 이슈를 한눈에 모니터링할 수 있습니다.",
  },
  {
    title: "KYC 및 본인 인증 상태 관리",
    desc: "하단 KYC 연동 기능을 통해 파이오니어 인증 상태 및 안전한 ID 보존 설정을 간편하게 관리할 수 있습니다.",
  },
  {
    title: "파이오니어 글로벌 커뮤니티 연결",
    desc: "공식 포럼, 글로벌 오픈채팅, 노드 기술 지원 채널을 통해 전 세계 파이오니어들과 소통 및 정보 공유가 가능합니다.",
  },
  {
    title: "안전한 Web3 환경 및 보안 최적화",
    desc: "비밀구절이나 개인키를 절대로 요구하지 않으며, 파이오니어의 자산을 안전하게 보호하는 웹3 환경을 최우선으로 제공합니다.",
  },
];

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
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
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[380px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0f1123] border border-purple-500/40 p-4 shadow-2xl flex flex-col gap-3.5 scrollbar-thin scrollbar-thumb-purple-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">GPNR 앱 이용방법</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 안내문 10가지 리스트 */}
        <div className="flex flex-col gap-2.5 my-1">
          {USAGE_GUIDE_KO.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-purple-900/30 hover:border-purple-500/50 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
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

        {/* 확인 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-950/50 active:scale-[0.98]"
        >
          확인 및 닫기
        </button>
      </div>
    </div>
  );
}

// 신규 미려한 커뮤니티 팝업 모달
export function CommunityModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const communityLinks = [
    { title: "공식 파이오니어 포럼", desc: "글로벌 생태계 주요 소식 & 토론", icon: Globe2, badge: "Official" },
    { title: "GPNR 글로벌 커뮤니티", desc: "실시간 파이 정보 공유 및 소통", icon: Share2, badge: "Community" },
    { title: "파이 노드 & 개발자 채널", desc: "노드 설정 및 기술 피드백 지원", icon: Bot, badge: "Tech" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[350px] rounded-2xl bg-[#0f1123] border border-purple-500/50 p-4 shadow-2xl flex flex-col gap-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-white">파이오니어 커뮤니티</span>
          </div>
          <button onClick={onClose} type="button" className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 my-1">
          {communityLinks.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400/80 hover:bg-purple-900/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-900/40 text-purple-300 group-hover:scale-105 transition-transform border border-purple-500/20">
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-purple-300">
                      {item.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30 font-medium">
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 transition-colors shrink-0" />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800/80 text-slate-300 font-medium text-xs hover:bg-slate-700 hover:text-white transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default UsageModal;
