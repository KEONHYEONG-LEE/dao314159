import { useState, useEffect } from "react";
import NewsCard from "./news-card";

// 뉴스 데이터 규격 정의
interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
}

// selectedCategory를 부모로부터 받아옵니다.
export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // 여기서 전 세계 뉴스를 가져오는 로직이 돌아갑니다.
    const fetchNews = async () => {
      // (임시) 실제 API 연결 전까지 보여줄 데이터 로직
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
        // ... 실제 데이터가 들어올 자리
      ];

      // 카테고리가 'all'이면 전체, 아니면 해당 카테고리만 필터링 후 10개만 자르기
      const filtered = allNews
        .filter(item => selectedCategory === "all" || item.category === selectedCategory)
        .slice(0, 10);

      setNews(filtered);
    };

    fetchNews();
  }, [selectedCategory]);

  return (
    <section className="mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 capitalize">{selectedCategory} News</h2>
      <div className="space-y-6">
        {news.length > 0 ? (
          news.map((item) => <NewsCard key={item.id} {...item} />)
        ) : (
          <p className="text-gray-500 text-center py-10">최신 뉴스를 불러오는 중입니다...</p>
        )}
      </div>
    </section>
  );
}
