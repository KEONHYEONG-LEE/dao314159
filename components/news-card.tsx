import { 
  Share2, 
  MessageSquare, 
  Heart, 
  EyeOff, 
  Bookmark, 
  ChevronDown, 
  Users,    /* 이 부분이 빠져서 에러가 났었습니다 */
  Youtube 
} from "lucide-react";

export default function NewsCard({ category, title, excerpt, date, author, image }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      {/* 카드 헤더 영역 */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-blue-600">Global Community</span>
        </div>
        <div className="flex gap-3 text-gray-300">
          <EyeOff className="w-4 h-4" />
          <Bookmark className="w-4 h-4" />
          <Heart className="w-4 h-4" />
        </div>
      </div>
      
      {/* 카드 본문 영역 */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{excerpt}</p>
        
        {/* 이미지 영역 */}
        {image && (
          <img 
            src={image} 
            alt="news" 
            className="w-full h-48 object-cover rounded-xl mb-4" 
          />
        )}
        
        {/* 푸터 영역 (날짜 및 소스) */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50 pt-3">
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-600" />
            <span>Pi Network Community</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{date}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className="flex gap-4 mt-3 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> 
            <span>Comments (0)</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" /> 
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}
