// components/usage-modal.tsx
// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import { X, HelpCircle, Users, ExternalLink, Globe, Code, ShieldCheck, Heart, Sparkles, Newspaper } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. 이용방법 팝업 (10가지 핵심 안내 항목)
export function UsageModal({ isOpen, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const usageSteps = [
    { 
      title: "1. 100% 무료 이용 & 자율 후원", 
      desc: "GPNR app은 파이오니어 누구나 무료로 이용 가능합니다. 앱 운영 및 서버 후원은 자율이며 1회당 0.01 Pi로 고정되어 있습니다." 
    },
    { 
      title: "2. 실시간 주요 뉴스 (최신순 배치)", 
      desc: "Web2 및 Web3의 Pi 관련 공신력 있는 사이트의 실시간 주요 뉴스를 각 주제별로 제공하며, 가장 최신 소식이 상단에 배치됩니다." 
    },
    { 
      title: "3. 원터치 런처 메뉴 (그리드 버튼)", 
      desc: "우측 상단 ☰ 메뉴를 통해 20개의 핵심 주제별 카테고리 모듈로 즉시 이동 및 설정할 수 있습니다." 
    },
    { 
      title: "4. 파이 생태계 커뮤니티 연결", 
      desc: "메뉴의 '커뮤니티' 모듈을 통해 파이 네트워크 공식 포털 및 검증된 글로벌 소통 채널로 빠르게 접속할 수 있습니다." 
    },
    { 
      title: "5. 가격 전망 및 디파이 정보", 
      desc: "파이 생태계의 실시간 가격 흐름, 시장 분석 전망, DEX 및 디파이(DeFi) 연동 소식을 한눈에 파악합니다." 
    },
    { 
      title: "6. KYC 및 계정 보안 가이드", 
      desc: "KYC 인증 통과 및 진행 방법, 파이 지갑 스캠 예방과 보안 강화를 위한 주의사항을 안내합니다." 
    },
    { 
      title: "7. 코어팀 로드맵 & 주요 일정", 
      desc: "[일정] 탭을 통해 파이 코어팀의 주요 발표 일정, 오픈 메인넷 전환 단계 및 이벤트 정보를 체크하세요." 
    },
    { 
      title: "8. 개발자 & DApp 생태계 포털", 
      desc: "파이 브라우저 기반 DApp 생태계 개발자를 위한 해커톤 소식, API 문서 및 리소스 링크를 제공합니다." 
    },
    { 
      title: "9. KYC ID 재설정 및 연결 관리", 
      desc: "런처 모달 하단에서 연결된 파이 계정 상태(Username/ID)를 확인하고, 필요 시 KYC ID 정보를 즉시 재설정할 수 있습니다." 
    },
    { 
      title: "10. 다국어 실시간 번역 지원", 
      desc: "플로팅 언어 스위처를 통해 전 세계 주요 언어로 기사를 번역하여 글로벌 소식을 손쉽게 열람할 수 있습니다." 
    }
  ];

  return (
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
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="notranslate"
        translate="no"
        style={{
          width: '100%',
          maxWidth: '420px',
          maxHeight: '82vh',
          backgroundColor: '#131528',
          border: '1px solid rgba(168, 85, 247, 0.5)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 65, 85, 0.8)', paddingBottom: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle className="w-5 h-5 text-purple-400 pointer-events-none" />
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f8fafc' }}>GPNR 이용방법 가이드</span>
          </div>
          <button onClick={onClose} type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        {/* 10가지 가이드 스크롤 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {usageSteps.map((step, idx) => (
            <div key={idx} style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '12px', padding: '12px
