
"use client";

import { useState } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import NewsFeed from "@/components/news-feed";

export default function Home() {
  // 현재 선택된 카테고리 상태 관리
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <main className="min-h-screen bg-background">
      {/* 카테고리 탭: 헤더 대용으로 최상단에 배치 */}
      <div className="pt-2">
        <CategoryTabs 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
        />
      </div>

      {/* 뉴스 피드 영역 */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <NewsFeed selectedCategory={selectedCategory} />
      </div>
    </main>
  );
}
