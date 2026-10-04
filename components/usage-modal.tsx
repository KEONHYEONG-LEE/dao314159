import React from 'react';
import { X, Flame, Globe, Users, Shield, Calendar, Sparkles } from 'lucide-react';

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

export function UsageModal({ isOpen, onClose, lang = 'ko' }: UsageModalProps) {
  if (!isOpen) return null;

  const isKo = lang === 'ko';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          maxHeight: '85vh',
          backgroundColor: '#16192e',
          border: '2px solid rgba(168, 85, 247, 0.4)',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          overflowY: 'auto',
          color: '#ffffff',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#e9d5ff' }}>
              {isKo ? '이용 방법 안내' : 'How to Use GPNR'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.5' }}>
          {isKo
            ? '원하는 카테고리를 상단 메뉴에서 선택하여 전 세계 파이네트워크(Pi Network) 소식을 실시간으로 확인하세요.'
            : 'Select categories from the top menu to check global Pi Network news in real time.'}
        </p>

        {/* 이용안내 가이드 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ backgroundColor: 'rgba(30, 35, 62, 0.7)', borderRadius: '14px', padding: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '13px', color: '#c084fc', marginBottom: '4px' }}>
              <Flame className="w-4 h-4 text-purple-400" />
              <span>{isKo ? '주요 뉴스 & 실시간 이슈' : 'Top News & Updates'}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              {isKo ? '파이 생태계 핵심 소식과 검증된 글로벌 뉴스를 한눈에 모아볼 수 있습니다.' : 'Check essential Pi Network ecosystem news at a glance.'}
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 35, 62, 0.7)', borderRadius: '14px', padding: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '13px', color: '#38bdf8', marginBottom: '4px' }}>
              <Users className="w-4 h-4 text-sky-400" />
              <span>{isKo ? '파이어니어 커뮤니티' : 'Pioneer Community'}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              {isKo ? '전 세계 파이어니어들과 의견을 나누고 정보 공유 글을 작성할 수 있습니다.' : 'Share thoughts and interact with global Pioneers.'}
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 35, 62, 0.7)', borderRadius: '14px', padding: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4ade80', marginBottom: '4px' }}>
              <Calendar className="w-4 h-4 text-green-400" />
              <span>{isKo ? '일정 & 메인넷 로드맵' : 'Schedule & Roadmap'}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              {isKo ? '주요 이벤트, 해커톤, 오픈 메인넷 카운트다운 일정을 체크하세요.' : 'Track major events and Open Mainnet timeline.'}
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 35, 62, 0.7)', borderRadius: '14px', padding: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '13px', color: '#f43f5e', marginBottom: '4px' }}>
              <Shield className="w-4 h-4 text-rose-400" />
              <span>{isKo ? '보안 & 피싱 예방' : 'Security & Anti-Phishing'}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              {isKo ? '지갑 비밀구절 관리 및 스캠 사이트 주의사항 안내를 확인하세요.' : 'Learn essential security practices to protect your Wallet Passphrase.'}
            </p>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '18px',
            padding: '10px 0',
            backgroundColor: '#7e22ce',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          {isKo ? '확인 및 닫기' : 'Close'}
        </button>
      </div>
    </div>
  );
}

