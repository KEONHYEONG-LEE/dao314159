"use client"; 

import { useState, useEffect } from "react";
import NewsCard from "./news-card"; 
// 1. 우리가 만든 실데이터 가져오기
import { NEWS_DATA } from "@/lib/news-data"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<any[]>([]); 

  useEffect(() => {
    // 2. NEWS_DATA를 화면 구조에 맞게 변환 (한국어 우선 적용)
    const formattedNews = NEWS_DATA.map(item => ({
      id: item.id,
      category: item.category.toLowerCase(),
      // 한국어 제목이 있으면 사용, 없으면 영어 사용
      title: item.title.ko || item.title.en, 
      // 지저분한 태그가 제거된 한국어 내용 사용
      content: item.content.ko || item.content.en, 
      author: item.author,
      date: item.date.split('T')[0], // 날짜만 깔끔하게 출력
      image: item.imageUrl, // 이제 실제 추출된 이미지 경로 연결
      url: item.url
    })); 

    // 3. 카테고리 필터링 로직
    const filtered = formattedNews.filter(
      item => selectedCategory === "all" || item.category === selectedCategory
    );
    
    setNews(filtered);
  }, [selectedCategory]); 

  return (
    <section className="mt-8 px-4 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold capitalize">
          {selectedCategory === 'all' ? '최신 뉴스' : `${selectedCategory} 소식`}
        </h2>
        <span className="text-xs text-gray-400">Total {news.length}</span>
      </div>

      <div className="space-y-6">
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard 
              key={item.id} 
              category={item.category}
              title={item.title}
              content={item.content} // 정제된 텍스트 전달
              date={item.date}
              source={item.author}
              image={item.image}
              url={item.url}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">해당 카테고리의 뉴스가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
