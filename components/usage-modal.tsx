// components/usage-modal.tsx
// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import { X, HelpCircle, BookOpen, Users, ExternalLink, Globe, MessageCircle, Code, ShieldCheck } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. 이용방법 팝업 (10가지 안내 항목)
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
    { title: "1. 실시간 파이 네트워크 뉴스 확인", desc: "주요뉴스, 메인넷, 노드, 채굴 등 카테고리별 실시간 소식을 빠르게 확인할 수 있습니다." },
    { title: "2. 자동 다국어 번역 지원", desc: "상단/하단 번역 설정을 통해 전 세계 주요 언어로 기사를 실시간 번역해 읽을 수 있습니다." },
    { title: "3. 런처 메뉴 활용 (그리드 버튼)", desc: "우측 상단 ☰ 메뉴를 눌러 원하는 카테고리로 빠르게 이동하거나 핵심 기능 팝업을 열 수 있습니다." },
    { title: "4. 생태계 커뮤니티 참여", desc: "메뉴의 '커뮤니티'를 통해 파이 네트워크 공식 채널 및 한국/글로벌 커뮤니티에 참여하세요." },
    { title: "5. 가격 전망 및 디파이 정보", desc: "파이 생태계 가격 흐름, 분석 전망, DEX 및 디파이 연동 정보를 한눈에 파악할 수 있습니다." },
    { title: "6. KYC 및 보안 가이드", desc: "KYC 인증 진행 방법과 계정 보안 강화를 위한 주의사항을 쉽게 안내합니다." },
    { title: "7. 주요 일정 및 로드맵 체크", desc: "파이 코어팀의 주요 발표 일정, 오픈 메인넷 로드맵을 주기적으로 업데이트받으세요." },
    { title: "8. 개발자 및 DApp 생태계", desc: "파이 브라우저 기반 DApp 개발자 가이드 및 해커톤 참여 소식을 확인하세요." },
    { title: "9. KYC ID 재설정 및 연결 관리", desc: "런처 하단에서 연결된 파이 계정 상태를 확인하고 필요한 경우 KYC ID 정보를 재설정할 수 있습니다." },
    { title: "10. 북마크 및 관심 뉴스 저장", desc: "중요한 기사를 북마크하여 언제든지 다시 찾아볼 수 있습니다." }
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
          maxHeight: '80vh',
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
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f8fafc' }}>GPNR 이용방법 가이드</span>
          </div>
          <button onClick={onClose} type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10가지 가이드 스크롤 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {usageSteps.map((step, idx) => (
            <div key={idx} style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#c084fc', marginBottom: '4px' }}>{step.title}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>{step.desc}</div>
            </div>
          ))}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          type="button"
          style={{
            marginTop: '16px',
            width: '100%',
            padding: '10px',
            borderRadius: '12px',
            background: 'linear-gradient(90deg, #9333ea, #c084fc)',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}

// 2. 미려한 디자인의 커뮤니티 팝업
export function CommunityModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  const communities = [
    { title: "파이 네트워크 공식 홈페이지", desc: "MinePi Official Portal", icon: Globe, link: "https://minepi.com" },
    { title: "글로벌 파이 커뮤니티", desc: "전 세계 개척자들의 통합 정보 채널", icon: Users, link: "https://minepi.com/blog/" },
    { title: "개발자 및 DApp 포털", desc: "Pi Developer Platform & API", icon: Code, link: "https://developer.minepi.com" },
    { title: "KYC & 보안 센터", desc: "계정 보안 및 인증 가이드", icon: ShieldCheck, link: "https://minepi.com/kyc/" },
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
          maxWidth: '380px',
          backgroundColor: '#131528',
          border: '1px solid rgba(168, 85, 247, 0.5)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 65, 85, 0.8)', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users className="w-5 h-5 text-purple-400" />
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f8fafc' }}>파이 생태계 커뮤니티</span>
          </div>
          <button onClick={onClose} type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {communities.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconComp className="w-4 h-4 text-purple-300" />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f1f5f9' }}>{item.title}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{item.desc}</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            );
          })}
        </div>

        <button
          onClick={onClose}
          type="button"
          style={{
            marginTop: '16px',
            width: '100%',
            padding: '10px',
            borderRadius: '12px',
            backgroundColor: '#1e293b',
            color: '#cbd5e1',
            fontWeight: 'bold',
            fontSize: '12px',
            border: '1px solid #334155',
            cursor: 'pointer'
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
