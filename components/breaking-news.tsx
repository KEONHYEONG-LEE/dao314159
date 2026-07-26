"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, ExternalLink } from "lucide-react";

// 기본 영어 모드를 위해 데이터 구조를 영어 기본값(en)과 한국어(ko)로 세분화
const breakingNewsRaw = [
  {
    id: "brk-1",
    text: "BREAKING: Pi Network announces official open mainnet transition schedule",
    detail: "The Pi Network core team has announced the official open mainnet transition schedule through their roadmap. This timeline includes accelerating KYC and ecosystem integration phases.",
    detailKo: "파이 네트워크 핵심 팀이 공식 로드맵을 통해 오픈 메인넷 전환 일정을 발표했습니다. 이번 일정에는 KYC 가속화 및 생태계 통합 단계가 포함되어 있습니다.",
    link: "https://minepi.com/blog"
  },
  {
    id: "brk-2",
    text: "BREAKING: Global Climate Summit reaches agreement on Carbon Neutral 2040",
    detail: "Major countries at the Global Climate Summit have reached a groundbreaking agreement to achieve carbon neutrality by 2040.",
    detailKo: "글로벌 기후 정상회의에서 주요국들이 2040년까지 탄소 중립을 달성하기 위한 전격적인 합의에 도달했습니다.",
    link: "#"
  },
  {
    id: "brk-3",
    text: "BREAKING: US Fed decides to cut interest rates by 0.25%p",
    detail: "The US Federal Reserve has cut its benchmark interest rate by 0.25%p, signaling a shift toward monetary easing as expected by the market.",
    detailKo: "미 연준이 시장의 예상대로 기준 금리를 0.25%p 인하하며 통화 완화 정책으로의 전환을 시사했습니다.",
    link: "#"
  }
];

export function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLang, setCurrentLang] = useState("en"); // 기본 영어 모드
  const [translatedNews, setTranslatedNews] = useState(breakingNewsRaw);

  useEffect(() => {
    const handleTranslation = async () => {
      // [동기화] category-tabs와 통일성을 위해 'language'와 'gpnr-language' 모두 대응 가능하도록 처리
      const targetLang = localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "en";
      setCurrentLang(targetLang);
      
      if (targetLang === "ko") {
        try {
          const translations = await Promise.all(
            breakingNewsRaw.map(async (item) => {
              const res = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(item.text)}`
              );
              const data = await res.json();
              return { 
                ...item, 
                text: data[0][0][0],
                detail: item.detailKo // 한국어 모드일 때는 한국어 상세문 매핑
              };
            })
          );
          setTranslatedNews(translations);
        } catch (error) {
          console.error("Breaking news translation failed", error);
        }
      } else {
        // 영어 모드일 때는 구글 번역을 거치지 않고 원본 데이터(순수 영어) 그대로 렌더링
        setTranslatedNews(breakingNewsRaw);
      }
    };

    handleTranslation();
    window.addEventListener("languageChange", handleTranslation);
    window.addEventListener("storage", handleTranslation); // 스토리지 변경 감지 추가
    return () => {
      window.removeEventListener("languageChange", handleTranslation);
      window.removeEventListener("storage", handleTranslation);
    };
  }, []);

  // 자동 롤링 효과 (확장된 상태에서는 멈춤)
  useEffect(() => {
    if (isExpanded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % translatedNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [translatedNews.length, isExpanded]);

  return (
    <div className="bg-red-950/20 border-y border-white/[0.05] backdrop-blur-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-2.5">
        {/* 상단 속보 바 (클릭 시 토글) */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-1.5 flex-shrink-0 bg-red-600 px-2 py-0.5 rounded shadow-sm shadow-red-900/50">
            <AlertCircle className="h-3 w-3 text-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">
              {/* [수정] 첫 번째 이미지 이슈 해결: 영어일 때는 핫이슈 대신 LIVE 노출 */}
              {currentLang === "ko" ? "실시간 핫이슈" : "LIVE"}
            </span>
          </div>
          
          <div className="relative overflow-hidden flex-1">
            <p className="text-[13px] font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
              {translatedNews[currentIndex]?.text}
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
          <div className="pl-[52px] pr-2">
            <p className="text-[12.5px] text-slate-300 leading-relaxed mb-3 border-l-2 border-red-800/50 pl-3">
              {translatedNews[currentIndex]?.detail}
            </p>
            <a 
              href={translatedNews[currentIndex]?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-red-400 font-bold hover:text-red-300 transition-colors"
            >
              {/* [수정] 하단 링크 버튼 텍스트도 모드에 따라 변경 */}
              {currentLang === "ko" ? "관련 소식 자세히 보기" : "Read More"}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
