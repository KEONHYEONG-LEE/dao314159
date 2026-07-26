"use client";

import { useState, useEffect } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2";

export function LatestNews() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLogin = () => {
      const savedId = localStorage.getItem('pi_user_id');
      setIsLoggedIn(!!savedId);
    };
    
    checkLogin();
    // 로그인 상태 변경 감지를 위해 이벤트 리스너 추가 (옵션)
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  const getText = (field: any) => {
    if (!field) return ""; 
    if (typeof field === "string") return field;
    return field.ko || field.en || ""; 
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  // [수정] 뉴스 확장 토글 로직: 로그인 체크 추가
  const handleToggleExpand = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요."); // 미로그인 시 팝업창
      return;
    }
    setExpandedId(expandedId === id ? null : id);
  };

  // [수정] 원문 링크 클릭 로직: 로그인 체크 추가
  const handleExternalClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-6 px-1 bg-[#0a0a0a]">
      <div className="flex flex-col">
        {NEWS_DATA.map((news) => (
          <div key={news.id} className="border-b border-white/[0.08]">
            <article
              onClick={() => handleToggleExpand(news.id)}
              className={`flex gap-4 py-5 px-3 transition-all cursor-pointer items-center ${
                expandedId === news.id ? "bg-white/[0.07]" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded font-bold uppercase">
                    {news.category}
                  </span>
                  {!isLoggedIn && <Lock className="w-3 h-3 text-slate-500" />} {/* 미로그인 표시 */}
                </div>
                <h3 className={`text-[15px] font-semibold leading-[1.5] mb-2 transition-colors ${
                  expandedId === news.id ? "text-blue-400" : "text-slate-200"
                } ${expandedId !== news.id && "line-clamp-2"}`}>
                  {getText(news.title)}
                </h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span className="text-blue-400 font-medium">{news.author}</span>
                  <span>{formatDate(news.publishedAt)}</span>
                  {expandedId === news.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </div>
              </div>
              
              {news.imageUrl && expandedId !== news.id && (
                <div className="w-[70px] h-[70px] rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                  <img src={news.imageUrl} alt="news" className="w-full h-full object-cover" />
                </div>
              )}
            </article>

            {/* 로그인 상태에서만 렌더링되거나 확장되는 상세 영역 */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              expandedId === news.id && isLoggedIn ? 'max-h-[5000px] opacity-100 border-t border-white/[0.05]' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-5 bg-white/[0.02]">
                {news.imageUrl && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-5">
                    <img src={news.imageUrl} alt="full-content" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="text-slate-300 text-[15px] underline-offset-4 leading-[1.9] whitespace-pre-wrap break-words">
                  {getText(news.content)}
                </div>
                
                <div className="mt-8 pt-4 border-t border-white/[0.05] flex justify-between items-center">
                  {/* [수정] 원문 출처 하이퍼링크 활성화 제어 */}
                  <button 
                    onClick={(e) => handleExternalClick(e, news.sourceUrl)}
                    className="text-[13px] text-blue-400 flex items-center gap-1.5 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> 
                    <span>원문 출처 이동</span>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(null);
                    }}
                    className="text-[12px] text-slate-500 hover:text-slate-300"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
