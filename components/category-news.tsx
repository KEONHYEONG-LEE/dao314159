"use client";

import Link from "next/link";
import { Zap, Monitor, TrendingUp, Wallet, Compass, Map, FileText, Users, ShoppingBag, Key, HelpCircle, Shield, Landmark } from "lucide-react";

// 17개 고유 카테고리별 원본 데이터 스키마 구성 (절대 깨지지 않는 고해상도 테크 이미지 주소로 전면 전개)
const categories = [
  {
    name: "MAINNET",
    id: "mainnet",
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    articles: [
      { id: "m1", title: "Pi Network 메인넷 전환 가속화: 노드 활성도 역대 최고치 기록", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&auto=format&fit=crop", date: "2026.05.23", source: "블록코노미" },
      { id: "m2", title: "프로토콜 22 업데이트 요약 및 보안 강화 안내", image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop", date: "2026.05.23", source: "GPNR Official" },
    ],
  },
  {
    name: "NODE",
    id: "node",
    icon: <Monitor className="w-4 h-4 text-blue-500" />,
    articles: [
      { id: "n1", title: "글로벌 파이 노드 안정성 향상을 위한 최적화 가이드", image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=400&auto=format&fit=crop", date: "2026.05.23", source: "GPNR Tech" }
    ]
  },
  {
    name: "MINING",
    id: "mining",
    icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
    articles: [
      { id: "mi1", title: "반감기 이후 기본 채굴률 변동 추이 분석 보고서", image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=400&auto=format&fit=crop", date: "2026.05.22", source: "GPNR Analytics" }
    ]
  },
  {
    name: "WALLET",
    id: "wallet",
    icon: <Wallet className="w-4 h-4 text-purple-500" />,
    articles: [
      { id: "w1", title: "파이 지갑 보안 설정 강화: 비밀구절 관리 주의사항", image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400&auto=format&fit=crop", date: "2026.05.22", source: "GPNR Security" }
    ]
  },
  {
    name: "BROWSER",
    id: "browser",
    icon: <Compass className="w-4 h-4 text-cyan-500" />,
    articles: [
      { id: "b1", title: "Pi Browser 생태계 앱 연동 인터페이스 대규모 리뉴얼 예고", image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=400&auto=format&fit=crop", date: "2026.05.22", source: "GPNR Dev" }
    ]
  },
  {
    name: "ROADMAP",
    id: "roadmap",
    icon: <Map className="w-4 h-4 text-orange-500" />,
    articles: [
      { id: "r1", title: "V2 로드맵 최종 단계 점검: 오픈메인넷 조건 충족 현황", image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=400&auto=format&fit=crop", date: "2026.05.21", source: "GPNR Center" }
    ]
  },
  {
    name: "WHITEPAPER",
    id: "whitepaper",
    icon: <FileText className="w-4 h-4 text-gray-400" />,
    articles: [
      { id: "wh1", title: "백서 개정안에 담긴 토큰 이코노미 핵심 메커니즘 해석", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=400&auto=format&fit=crop", date: "2026.05.21", source: "GPNR Editor" }
    ]
  },
  {
    name: "COMMUNITY",
    id: "community",
    icon: <Users className="w-4 h-4 text-indigo-400" />,
    articles: [
      { id: "c1", title: "글로벌 파이어니어 5500만 명 돌파 기념 커뮤니티 이벤트 개최", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop", date: "2026.05.20", source: "GPNR News" }
    ]
  },
  {
    name: "COMMERCE",
    id: "commerce",
    icon: <ShoppingBag className="w-4 h-4 text-pink-500" />,
    articles: [
      { id: "co1", title: "온·오프라인 파이 결제 매장 확산 추세와 GCV 동향", image: "https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=400&auto=format&fit=crop", date: "2026.05.20", source: "GPNR Biz" }
    ]
  },
  {
    name: "KYC",
    id: "kyc",
    icon: <Key className="w-4 h-4 text-teal-500" />,
    articles: [
      { id: "k1", title: "KYC 인증 지연 해소를 위한 AI 알고리즘 고도화 패치 완료", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400&auto=format&fit=crop", date: "2026.05.19", source: "GPNR Tech" }
    ]
  },
  {
    name: "DEVELOPER",
    id: "developer",
    icon: <FileText className="w-4 h-4 text-blue-400" />,
    articles: [
      { id: "d1", title: "해커톤 우수 수상작들의 메인넷 API 마이그레이션 가이드", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop", date: "2026.05.18", source: "GPNR Dev" }
    ]
  },
  {
    name: "ECOSYSTEM",
    id: "ecosystem",
    icon: <HelpCircle className="w-4 h-4 text-lime-500" />,
    articles: [
      { id: "e1", title: "유틸리티 기반 대형 DApp 생태계 공식 온보딩 일정 공개", image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=400&auto=format&fit=crop", date: "2026.05.17", source: "GPNR Official" }
    ]
  },
  {
    name: "OUTLOOK",
    id: "outlook",
    icon: <TrendingUp className="w-4 h-4 text-violet-500" />,
    articles: [
      { id: "ou1", title: "2026년 가상자산 시장 규제 변화와 파이의 전망", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=400&auto=format&fit=crop", date: "2026.05.16", source: "GPNR Economy" }
    ]
  },
  {
    name: "PRICE",
    id: "price",
    icon: <Landmark className="w-4 h-4 text-amber-600" />,
    articles: [
      { id: "p1", title: "각국 커뮤니티별 GCV 합의 가격대 모니터링 분석", image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop", date: "2026.05.15", source: "GPNR Market" }
    ]
  },
  {
    name: "SECURITY",
    id: "security",
    icon: <Shield className="w-4 h-4 text-red-500" />,
    articles: [
      { id: "s1", title: "피싱 사이트 및 가짜 파이 코인 거래소 사기 근절 방지 대책", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop", date: "2026.05.14", source: "GPNR Security" }
    ]
  },
  {
    name: "LEGAL",
    id: "legal",
    icon: <Landmark className="w-4 h-4 text-slate-400" />,
    articles: [
      { id: "l1", title: "미국 SEC 가상자산 프레임워크 변경이 웹3 생태계에 미치는 영향", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop", date: "2026.05.13", source: "GPNR Legal" }
    ]
  }
];

export function CategoryNews({ selectedCategory = "all" }: { selectedCategory?: string }) {
  const filteredCategories = selectedCategory === "all"
    ? categories
    : categories.filter(cat => cat.id === selectedCategory);

  return (
    <section className="py-2 px-1 bg-[#0f172a]">
      <div className="grid grid-cols-1 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.name} className="flex flex-col">
            {/* 섹션 헤더 */}
            <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <h2 className="text-xs font-black text-slate-100 tracking-widest uppercase">
                  {category.name}
                </h2>
              </div>
            </div>

            {/* 뉴스 리스트 */}
            <div className="flex flex-col">
              {category.articles.map((article) => (
                <Link key={article.id} href={`/news/${article.id}`} className="group block border-b border-white/[0.05] last:border-0">
                  <article className="flex gap-4 py-4 items-center">
                    
                    {/* 텍스트 영역 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                        {article.title}
                      </h3>
                      
                      {/* 하단 정보 영역 */}
                      <div className="flex items-center justify-between gap-2 mt-3">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 whitespace-nowrap">
                          <span className="text-blue-500 font-bold">{article.source}</span>
                          <span>{article.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* 🚀 구글 번역기 및 모바일 프록시 환경에서 절대 안 터지도록 차단 보완 */}
                    <div className="relative w-16 h-16 flex
