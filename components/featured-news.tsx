"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, TrendingUp, Star, Heart, Check, ExternalLink } from "lucide-react";

// 초기 데이터 예시 (실제 데이터에 content 필드가 포함되어야 합니다)
const initialFeaturedArticle = { 
  id: "feat-main", 
  category: "주요이슈", 
  title: "Pi Network's Strategic Vision for 2026: What to Expect", 
  image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000",
  date: "2026.05.10",
  content: "파이 네트워크의 2026년 전략적 비전은 오픈 메인넷 이후의 생태계 확장에 초점을 맞추고 있습니다. 특히 탈중앙화 커머스와 AI 통합을 통한 실질적 유틸리티 창출이 핵심 과제입니다.",
  url: "https://minepi.com"
};

const initialSecondaryArticles = [
  { 
    id: "feat-1", 
    category: "커뮤니티", 
    title: "Global Nodes Reach New Milestone", 
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=200",
    date: "2026.05.09",
    content: "전 세계 파이 노드 수가 역대 최고치를 경신하며 네트워크 보안성이 한층 강화되었습니다.",
    url: "#"
  },
  { 
    id: "feat-2", 
    category: "경제", 
    title: "The Impact of GCV on Pi Ecosystem", 
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=200",
    date: "2026.05.09",
    content: "글로벌 합의 가치(GCV)가 생태계 내부 거래 시장에 미치는 영향에 대한 심층 분석 보고서입니다.",
    url: "#"
  }
];

export function FeaturedNews() {
  const [featured, setFeatured] = useState(initialFeaturedArticle);
  const [secondary, setSecondary] = useState(initialSecondaryArticles);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // 현재 확장된 뉴스 ID 관리
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-6 px-1">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-bold text-white tracking-tight uppercase">Featured</h2>
        </div>
        <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors">
          전체보기 <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* [메인 기사] */}
        <div className="lg:col-span-2 group flex flex-col">
          <article 
            onClick={() => toggleExpand(featured.id)}
            className={`relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/5 cursor-pointer transition-all ${expandedId === featured.id ? 'rounded-b-none' : ''}`}
          >
            <Image src={featured.image} alt="Featured" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-2 py-0.5 mb-3 text-[10px] font-bold bg-orange-600 text-white rounded uppercase tracking-tighter">
                {featured.category}
              </span>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors">
                {isTranslating ? "번역 중..." : featured.title}
              </h3>
              <div className="flex items-center gap-4 text-[11px] text-slate-300 font-medium">
                <span className="text-blue-400 font-bold tracking-widest">GPNR FOCUS</span>
                <span>{featured.date}</span>
              </div>
            </div>
          </article>

          {/* 메인 기사 풀다운 영역 */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden bg-slate-900/40 rounded-b-2xl border-x border-b border-white/5 ${expandedId === featured.id ? 'max-h-[500px] opacity-100 p-6' : 'max-h-0 opacity-0'}`}>
            <p className="text-slate-300 text-[15px] leading-relaxed mb-4">
              {featured.content}
            </p>
            <a href={featured.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-orange-500 font-bold hover:text-orange-400">
              <ExternalLink className="w-4 h-4" /> 원문 읽기
            </a>
          </div>
        </div>

        {/* [서브 기사들] */}
        <div className="flex flex-col">
          {secondary.map((article, idx) => (
            <div key={article.id} className={`${idx !== 0 ? "mt-1" : ""}`}>
              <article 
                onClick={() => toggleExpand(article.id)}
                className={`flex gap-4 py-4 px-2 items-center border-b border-white/[0.05] last:border-0 cursor-pointer transition-colors hover:bg-white/[0.03] ${expandedId === article.id ? 'bg-white/[0.05]' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-orange-500 font-bold mb-1 block uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h4 className={`text-[14px] font-semibold leading-snug line-clamp-2 transition-colors mb-2 ${expandedId === article.id ? 'text-blue-400' : 'text-slate-200 group-hover:text-blue-400'}`}>
                    {isTranslating ? "..." : article.title}
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="text-blue-400 font-bold">GPNR</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/5 bg-slate-800">
                  <Image src={article.image} alt="Thumbnail" fill className="object-cover" />
                </div>
              </article>

              {/* 서브 기사 풀다운 영역 */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden bg-black/20 ${expandedId === article.id ? 'max-h-[300px] opacity-100 p-4 border-b border-white/[0.05]' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-400 text-[13px] leading-relaxed mb-3">
                  {article.content}
                </p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-orange-400 font-bold">
                   원문 확인 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
