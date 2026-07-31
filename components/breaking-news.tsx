"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, ExternalLink } from "lucide-react";

interface NewsItem {
  id: string;
  title: string | { ko: string; en: string };
  content?: string | { ko: string; en: string };
  titleObj?: { ko: string; en: string };
  contentObj?: { ko: string; en: string };
  sourceUrl?: string;
  link?: string;
}

// API 연결 실패 시 사용할 기본 백업 데이터
const FALLBACK_BREAKING_NEWS = [
  {
    id: "brk-1",
    textKo: "속보: 파이 네트워크 오픈 메인넷 전환 및 생태계 확장 가속화",
    textEn: "BREAKING: Pi Network Open Mainnet Transition and Ecosystem Expansion Accelerates",
    detailKo: "파이 네트워크 핵심 팀이 오픈 메인넷 전환 일정을 추진하며, KYC 가속화 및 글로벌 생태계 dApp 통합을 확대하고 있습니다.",
    detailEn: "The Pi Network Core Team accelerates open mainnet transition schedules, expanding KYC verification and dApp integrations.",
    link: "https://minepi.com"
  }
];

export function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLang, setCurrentLang] = useState("ko");
  const [newsItems, setNewsItems] = useState<any[]>(FALLBACK_BREAKING_NEWS);

  // 1. 현재 언어 설정 감지
  useEffect(() => {
    const checkLang = () => {
      const targetLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "ko";
      setCurrentLang(targetLang);
    };

    checkLang();
    window.addEventListener("languageChange", checkLang);
    window.addEventListener("storage", checkLang);
    return () => {
      window.removeEventListener("languageChange", checkLang);
      window.removeEventListener("storage", checkLang);
    };
  }, []);

  // 2. 실시간 API 뉴스 가져오기 (/api/fetch-news 연동)
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/fetch-news?category=ALL");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // 최신순 상위 5개 헤드라인 자동 추출
          const formatted = data.slice(0, 5).map((item: NewsItem, idx: number) => {
            let titleKo = "";
            let titleEn = "";

            if (typeof item.title === "string") {
              titleKo = item.title;
              titleEn = item.title;
            } else if (item.title && typeof item.title === "object") {
              titleKo = item.title.ko || item.title.en || "";
              titleEn = item.title.en || item.title.ko || "";
            } else if (item.titleObj) {
              titleKo = item.titleObj.ko;
              titleEn = item.titleObj.en;
            }

            let detailKo = "";
            let detailEn = "";
            if (typeof item.content === "string") {
              detailKo = item.content;
              detailEn = item.content;
            } else if (item.content && typeof item.content === "object") {
              detailKo = item.content.ko || item.content.en || "";
              detailEn = item.content.en || item.content.ko || "";
            } else if (item.contentObj) {
              detailKo = item.contentObj.ko;
              detailEn = item.contentObj.en;
            }

            return {
              id: item.id || `brk-api-${idx}`,
              textKo: titleKo || "최신 뉴스 헤드라인을 불러오는 중입니다...",
              textEn: titleEn || "Loading latest headline...",
              detailKo: detailKo || titleKo,
              detailEn: detailEn || titleEn,
              link: item.sourceUrl || item.link || "https://minepi.com"
            };
          });

          setNewsItems(formatted);
        }
      } catch (error) {
        console.error("Breaking news fetch error:", error);
      }
    };

    fetchNews();
  }, []);

  // 3. 자동 롤링 효과 (5초 간격으로 자동으로 최신 기사 1~5번 교체)
  useEffect(() => {
    if (isExpanded || newsItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [newsItems.length, isExpanded]);

  const currentNews = newsItems[currentIndex] || newsItems[0];
  const displayText = currentLang === "ko" ? (currentNews?.textKo || currentNews?.textEn) : (currentNews?.textEn || currentNews?.textKo);
  const displayDetail = currentLang === "ko" ? (currentNews?.detailKo || currentNews?.detailEn) : (currentNews?.detailEn || currentNews?.detailKo);

  return (
    <div className="bg-red-950/20 border-y border-white/[0.05] backdrop-blur-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-2.5">
        {/* 상단 속보 바 (클릭 시 풀다운 확장) */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-1.5 flex-shrink-0 bg-red-600 px-2 py-0.5 rounded shadow-sm shadow-red-900/50">
            <AlertCircle className="h-3 w-3 text-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-tighter notranslate skiptranslate" translate="no">
              {currentLang === "ko" ? "실시간 핫이슈" : "LIVE"}
            </span>
          </div>
          
          {/* 구글 번역 엔진 오역을 방지하기 위한 속성 적용 */}
          <div className="relative overflow-hidden flex-1 notranslate skiptranslate" translate="no">
            <p key={currentIndex} className="text-[13px] font-semibold text-slate-200 truncate group-hover:text-white transition-all duration-300 animate-in fade-in slide-in-from-bottom-1">
              {displayText}
            </p>
          </div>

          <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>

        {/* 풀다운 상세 영역 */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-40 opacity-100 mt-3 pb-2' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pl-[52px] pr-2 notranslate skiptranslate" translate="no">
            <p className="text-[12.5px] text-slate-300 leading-relaxed mb-3 border-l-2 border-red-800/50 pl-3">
              {displayDetail}
            </p>
            <a 
              href={currentNews?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-red-400 font-bold hover:text-red-300 transition-colors"
            >
              {currentLang === "ko" ? "관련 소식 자세히 보기" : "Read More"}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
