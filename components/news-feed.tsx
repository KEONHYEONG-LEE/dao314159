"use client";

import { useState, useEffect } from "react";
import NewsCard from "./news-card"; 

interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
} 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 

  useEffect(() => {
    // Pi Browser의 구형 엔진을 위해 데이터를 동기적으로 즉시 설정
    const allNews: NewsItem[] = [
      {
        id: "1",
        category: "mainnet",
        title: "Pi Network Mainnet Migration Update",
        excerpt: "The latest news on the Open Mainnet preparation...",
        author: "GPNR AI",
        date: "2026-03-29",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800"
      },
      {
        id: "2",
        category: "community",
        title: "Global Pi Community Growing Fast",
        excerpt: "New nodes are being added globally at an incredible rate.",
        author: "GPNR AI",
        date: "2026-04-01",
        image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800"
      }
    ]; 

    const filtered = allNews.filter(
      item => selectedCategory === "all" || item.category === selectedCategory
    );
    
    setNews(filtered);
  }, [selectedCategory]); 

  return (
    <section className="mt-8 px-4 pb-10">
      <h2 className="text-2xl font-bold mb-6 capitalize">{selectedCategory} News</h2>
      <div className="space-y-6">
        {news.length > 0 ? (
          news.map((item) => <NewsCard key={item.id} {...item} />)
        ) : (
          <p className="text-gray-500 text-center py-10">뉴스를 불러오는 중입니다...</p>
        )}
      </div>
    </section>
  );
}
