"use client";

import { useState } from "react";
import { 
  Share2, 
  Heart, 
  EyeOff, 
  Bookmark, 
  ChevronDown, 
  Users,
  Youtube,
  Sparkles,
  X,
  ExternalLink,
  Calendar
} from "lucide-react";

// 유틸리티 함수 (cn 함수가 없을 경우를 대비해 직접 구현)
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const stripHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function NewsCard({ category, title, content, date, source, image, url }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cleanContent = stripHtml(content);

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setSummary("GPNR AI가 분석 중입니다...");
    
    // 언어 감지 로직
    const headerElement = document.querySelector('header');
    const headerText = headerElement?.innerText || "";
    let currentLang = "ko";
    if (headerText.includes('English')) currentLang = "en";
    else if (headerText.includes('中国')) currentLang = "zh";
    else if (headerText.includes('Tiếng Việt')) currentLang = "vi";

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cleanContent, lang: currentLang }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("요약 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            {/* Badge 대신 직접 span 디자인 적용 */}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
              {category && category !== 'ALL' ? category : 'Pi Network'}
            </span>
          </div>
          <div className="flex gap-3 text-gray-300">
            <EyeOff className="w-4 h-4" />
            <Bookmark className="w-4 h-4" />
            <Heart className="w-4 h-4" />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{cleanContent}</p>
          
          {image && (
            <div className="rounded-xl overflow-hidden mb-4">
              <img src={image} alt="news" className="w-full h-48 object-cover transition-transform hover:scale-105 duration-500" />
            </div>
          )}
          
          <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-gray-600">{source || "GPNR News"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* 뉴스 상세 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
              className="absolute right-4 top-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {image && <img src={image} alt="news" className="w-full h-52 object-cover rounded-2xl mb-6 mt-2 shadow-sm" />}
            
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-2">
              {category && category !== 'ALL' ? category : 'Global Community'}
            </span>
            <h2 className="text-2xl font-bold mb-4 leading-tight text-gray-900">{title}</h2>
            
            <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap text-[16px]">
              {cleanContent}
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 mb-8">
              {/* Button 대신 직접 button 디자인 적용 */}
              <button 
                onClick={handleSummarize}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold mb-4 shadow-lg flex items-center justify-center gap-2 text-base transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className={cn("w-5 h-5", isLoading && "animate-spin")} />
                {isLoading ? "분석 중..." : "GPNR AI 핵심 내용 요약하기"}
              </button>

              {summary && (
                <div className="bg-white/90 rounded-xl p-4 text-sm text-indigo-900 border border-indigo-50 shadow-sm">
                  <p className="font-bold mb-2 flex items-center gap-1.5 text-indigo-600">
                    ✨ AI 분석 리포트
                  </p>
                  <p className="leading-relaxed whitespace-pre-line">{summary}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pb-2">
              <a 
                href={url || "#"} 
                target="_blank" 
                className="flex-1 py-4 rounded-xl border border-gray-200 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4" /> 원문 보기
              </a>
              <button className="flex-1 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> 공유하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
