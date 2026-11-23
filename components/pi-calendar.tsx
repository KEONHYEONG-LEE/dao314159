// @ts-nocheck
import React, { useState } from 'react';
import translations from './translations';

interface EventItem {
  id: string;
  periodKo?: string;
  periodEn?: string;
  titleKo: string;
  titleEn: string;
  statusKo: string;
  statusEn: string;
  detailKo?: string;
  detailEn?: string;
  badgeType?: 'purple' | 'blue' | 'green';
}

interface PiCalendarProps {
  lang?: string;
}

const DEFAULT_FIVE_YEAR_EVENTS: EventItem[] = [
  {
    id: '2026-2027-hackathon-growth',
    periodKo: '2026.11 – 2027.01',
    periodEn: 'Nov 2026 – Jan 2027',
    titleKo: 'Pi Next 해커톤(~1/5) 및 앱 성장 지원',
    titleEn: 'Pi Next Hackathon (~Jan 5) & App Growth',
    statusKo: '진행 중',
    statusEn: 'Active',
    detailKo:
      '총 20만 USDT 상금 규모의 Pi Next 해커톤 출품 접수(~2027.01.05)와 우수 앱 대상 최대 2,000만 Pi 규모의 성장 지원 예산이 순차 집행됩니다.',
    detailEn:
      'Submissions open for the $200K USDT Pi Next Hackathon (through Jan 5, 2027) alongside up to 20M Pi in ecosystem app growth funding.',
    badgeType: 'purple',
  },
  {
    id: '2027-q1-defi-infra',
    periodKo: '2027년 1분기 목표',
    periodEn: 'Target Q1 2027',
    titleKo: 'Pi DEX · AMM · Launchpad 메인넷 출시',
    titleEn: 'Pi DEX, AMM & Launchpad Mainnet',
    statusKo: '출시 예정',
    statusEn: 'Upcoming',
    detailKo:
      '테스트넷 검증을 마친 탈중앙화 거래소(DEX), 자동화 마켓 메이커(AMM), 토큰 런치패드 인프라가 메인넷에 정식 도입될 예정입니다.',
    detailEn:
      'On-chain DEX, AMM liquidity pools, and token launchpad infrastructure are targeted for mainnet rollout following testnet validation.',
    badgeType: 'blue',
  },
  {
    id: '2027-unlock-utility',
    periodKo: '2027년 중장기',
    periodEn: 'Mid-to-Late 2027',
    titleKo: 'KYC 마이그레이션 및 초기 물량 언락 소화',
    titleEn: 'KYC Migration & Early Unlock Absorption',
    statusKo: '전진 중',
    statusEn: 'In Progress',
    detailKo:
      '패스트트랙·마이그레이션 물량 해제가 이어지는 구간으로, 유통량 증가 속도와 실사용 앱·커머스 수요의 균형이 핵심 과제입니다.',
    detailEn:
      'As migration and token unlocks progress, balancing circulating supply growth against real app and commerce demand remains key.',
    badgeType: 'green',
  },
  {
    id: '2028-2029-contracts-commerce',
    periodKo: '2028년 – 2029년',
    periodEn: '2028 – 2029',
    titleKo: '구독형 컨트랙트 · x402 · OUSD 상용화',
    titleEn: 'Subscriptions, x402 & OUSD Rollout',
    statusKo: '중기 로드맵',
    statusEn: 'Mid-Term',
    detailKo:
      '테스트넷 선행 적용된 구독형 스마트 컨트랙트, x402 소액 결제, OUSD 스테이블코인 연동이 메인넷 실서비스로 확장될 전망입니다.',
    detailEn:
      'Recurring subscription contracts, x402 micro-payments, and OUSD integration are slated to expand into broader mainnet usage.',
    badgeType: 'blue',
  },
  {
    id: '2028-2029-supply-moderation',
    periodKo: '2028년 – 2029년',
    periodEn: '2028 – 2029',
    titleKo: '초기 언락 압력 완화 및 앱 수익화 성숙',
    titleEn: 'Unlock Moderation & App Monetization',
    statusKo: '전망',
    statusEn: 'Outlook',
    detailKo:
      '오픈 네트워크 초기 집중되던 마이그레이션·언락 물량이 점차 완화되며, 파이 브라우저 내 실사용 소비와 앱 수익화가 자리 잡는 시기입니다.',
    detailEn:
      'Early migration and unlock waves are expected to moderate while in-app utility and commerce monetization mature across the ecosystem.',
    badgeType: 'purple',
  },
  {
    id: '2030-2031-global-scale',
    periodKo: '2030년 – 2031년',
    periodEn: '2030 – 2031',
    titleKo: '글로벌 소액 결제망 안착 및 제도권 확장',
    titleEn: 'Global Micro-Payments & Institutional Scale',
    statusKo: '5년 비전',
    statusEn: '5Y Vision',
    detailKo:
      '글로벌 사용자 기반을 바탕으로 소액 결제·크로스보더 유틸리티가 확산되고, 주요 거래소 상장 확대 및 규제 환경 안착 여부가 주목됩니다.',
    detailEn:
      'Focus shifts to scaling global micro-payments and cross-border utility alongside broader exchange availability and regulatory clarity.',
    badgeType: 'green',
  },
];

export const PiCalendar: React.FC<PiCalendarProps> = ({ lang = 'ko' }) => {
  const isKo = lang === 'ko';
  const t = translations[lang] || translations.ko;

  const [events] = useState<EventItem[]>(DEFAULT_FIVE_YEAR_EVENTS);
  const [expandedId, setExpandedId] = useState<string | null>('2026-2027-hackathon-growth');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'purple':
        return 'bg-purple-950/70 text-purple-300 border-purple-500/40';
      case 'blue':
        return 'bg-blue-950/70 text-blue-300 border-blue-500/40';
      case 'green':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800/80 text-slate-300 border-slate-600/60';
    }
  };

  return (
    <section
      aria-label={t.schedule_title}
      className="w-full max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-b from-[#16192b] to-[#111320] border border-slate-800/90 shadow-xl text-white"
    >
      {/* 상단 헤더 */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-base shrink-0">
            📅
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-white leading-snug">
              {t.schedule_title}
            </h3>
            <p className="text-[11px] font-medium text-indigo-300/90">
              {t.schedule_subtitle}
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/25 font-medium shrink-0">
          {isKo ? '기본 탑재' : 'Default'}
        </span>
      </div>

      {/* 안내 문구 */}
      <p className="text-xs leading-relaxed text-slate-400 mb-3.5">
        {t.schedule_desc}
      </p>

      {/* 이벤트 리스트 */}
      <div className="space-y-2.5">
        {events.map((event) => {
          const isExpanded = expandedId === event.id;
          const periodLabel = isKo ? event.periodKo : event.periodEn;
          const titleText = isKo ? event.titleKo : event.titleEn;
          const statusText = isKo ? event.statusKo : event.statusEn;
          const detailText = isKo ? event.detailKo : event.detailEn;

          return (
            <div
              key={event.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-[#1d2136] border-indigo-500/40 shadow-md'
                  : 'bg-[#181b2c]/90 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(event.id)}
                className="w-full flex items-center justify-between gap-2.5 p-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  {periodLabel && (
                    <div className="text-[10px] font-semibold text-slate-400 mb-0.5">
                      {periodLabel}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-400 text-xs shrink-0">📍</span>
                    <span className="text-xs font-semibold text-slate-100 leading-snug break-words">
                      {titleText}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold whitespace-nowrap ${getBadgeStyle(
                      event.badgeType
                    )}`}
                  >
                    {statusText}
                  </span>
                  {detailText && (
                    <span className="text-[11px] text-slate-400 w-4 text-center">
                      {isExpanded ? '▴' : '▾'}
                    </span>
                  )}
                </div>
              </button>

              {isExpanded && detailText && (
                <div className="px-3 pb-3 pt-0.5 border-t border-slate-800/70">
                  <p className="text-[11px] leading-relaxed text-slate-300 pt-2">
                    {detailText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 주석 */}
      <p className="mt-3 text-[10px] leading-normal text-slate-500">
        {t.schedule_note}
      </p>
    </section>
  );
};

export default PiCalendar;
