"use client";

import { useState, useEffect } from "react";

// 17개 카테고리 정의
const CATEGORIES = [
  'all', 'mainnet', 'community', 'commerce', 'node', 'mining', 'wallet', 
  'browser', 'kyc', 'developer', 'ecosystem', 'listing', 'price', 
  'security', 'event', 'roadmap', 'whitepaper', 'legal'
];

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        
        const articles = Array.isArray(data) ? data : (data.articles || []);
        setNews(articles);
      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-10">
      <header className="bg-[#0D1B3E] text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <span className="text-xl font-black tracking-tighter">GPNR</span>
      </header>

      {/* 3. 17개 카테고리 네비게이션 */}
      <nav className="flex gap-2 p-3 overflow-x-auto bg-white border-b no-scrollbar sticky top-[48px] z-40">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex-shrink-0 border ${
              activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400 text-sm">Loading News...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            /* 2. 클릭 시 바로 원문 URL로 이동하도록 하이퍼링크(<a>) 적용 */
            <a 
              key={idx} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex gap-4 p-4 active:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-bold text-[15px] line-clamp-2 text-gray-900 leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-indigo-500">{item.source}</span>
                  {/* 1. 기사 날짜 추가 */}
                  <span className="text-[10px] text-gray-300">{item.date}</span>
                </div>
              </div>
              {item.imageUrl && (
                <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl bg-gray-50 flex-shrink-0" alt="" />
              )}
            </a>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400 text-sm">No news available.</div>
        )}
      </main>
    </div>
  );
}
