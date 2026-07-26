"use client"; 

import { useState } from "react";
import { 
  Share2, Heart, EyeOff, Bookmark, ChevronDown, 
  Users, Youtube, Sparkles, X, ExternalLink, Calendar 
} from "lucide-react"; 

const cn = (...classes: any[]) => classes.filter(Boolean).join(" "); 

export default function NewsCard({ category, title, content, date, source, image, url }: any) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. HTML 태그 및 &nbsp; 등을 제거하는 함수 (목록 및 텍스트 정제용)
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>?/gm, "") // 태그 제거
      .replace(/&nbsp;/g, " ")    // 공백 변환
      .replace(/&amp;/g, "&")     // 특수문자 변환
      .trim();
  };

  // 2. 이미지 URL 추출 로직 (이미지 경로가 없거나 비어있을 때 content 내부에서 추출)
  const displayImage = image || (content?.match(/<img[^>]+src="([^">]+)"/) ? content.match(/<img[^>]+src="([^">]+)"/)[1] : null);

  return (
    <>
      {/* 뉴스 카드 목록 영역 */}
      <div onClick={() => setIsOpen(true)} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 cursor-pointer hover:shadow-md transition-shadow">
        <div className="p-4 border-b border-gray-50 flex justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">
            {category || 'Mainnet'}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 leading-tight">{title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{stripHtml(content)}</p>
        </div>
      </div> 

      {/* 뉴스 상세 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl max-h-[95vh] overflow-y-auto relative">
            
            {/* 상단 닫기 버튼 */}
            <div className="sticky top-0 right-0 p-4 flex justify-end z-10">
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/80 backdrop-blur shadow-md rounded-full">
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            <div className="px-6 pb-10">
              {/* [수정 1] 이미지 출력: 추출된 이미지가 있으면 보여줌, 없으면 기본 디자인 유지 */}
              {displayImage ? (
                <img 
                  src={displayImage} 
                  alt="news" 
                  className="w-full h-56 object-cover rounded-2xl mb-6 shadow-sm"
                  onError={(e: any) => e.target.style.display = 'none'} // 이미지 로드 실패 시 숨김
                />
              ) : (
                <div className="w-full h-1 bg-gray-50 mb-4" /> // 이미지 없을 때 여백
              )}
              
              <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>
              
              {/* [수정 2] a href 대신 본문 출력: HTML 태그를 깔끔하게 정제하여 출력 */}
              <div className="text-gray-700 leading-relaxed mb-8 text-[16px] break-words">
                {/* HTML 태그가 지저분하게 섞여있는 경우 stripHtml로 정제된 텍스트만 보여줍니다. 
                   만약 태그 내의 링크나 스타일을 살리고 싶다면 <div dangerouslySetInnerHTML... />을 사용하세요.
                */}
                {stripHtml(content)}
              </div>

              {/* 하단 버튼 그룹 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  onClick={() => window.open(url, '_blank')}
                  className="flex items-center justify-center gap-2 bg-gray-100 py-4 rounded-xl font-bold text-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  원문 기사 사이트
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-900 py-4 rounded-xl font-bold text-white">
                  <Share2 className="w-4 h-4" />
                  소식 공유하기
                </button>
              </div>

              {/* [수정 3] AI 요약 버튼: 작동 안 하면 삭제하거나 주석 처리 */}
              {/* <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  GPNR AI 핵심 내용 요약하기
                </button> 
              </div> 
              */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
