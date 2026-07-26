"use client";

import Link from "next/link";
import { ArrowRight, Clock, Zap } from "lucide-react";

const latestNews = [
  {
    id: 5,
    title: "유럽 중앙은행, 기준금리 동결 결정",
    category: "경제",
    date: "3시간 전",
    source: "로이터",
  },
  {
    id: 6,
    title: "한국 반도체 수출, 사상 최고치 기록",
    category: "경제",
    date: "4시간 전",
    source: "연합뉴스",
  },
  {
    id: 7,
    title: "NASA, 화성 유인 탐사 2030년 목표 발표",
    category: "과학",
    date: "5시간 전",
    source: "AP",
  },
  {
    id: 8,
    title: "글로벌 5G 가입자 20억 돌파",
    category: "기술",
    date: "6시간 전",
    source: "GSMA",
  },
  {
    id: 9,
    title: "세계보건기구, 신종 바이러스 모니터링 강화",
    category: "건강",
    date: "7시간 전",
    source: "WHO",
  },
  {
    id: 10,
    title: "전기차 배터리 기술 혁신, 충전 시간 50% 단축",
    category: "기술",
    date: "8시간 전",
    source: "테크크런치",
  },
  {
    id: 11,
    title: "2026 월드컵 예선, 아시아 지역 결과",
    category: "스포츠",
    date: "9시간 전",
    source: "FIFA",
  },
  {
    id: 12,
    title: "글로벌 식량 가격 지수 3개월 연속 하락",
    category: "경제",
    date: "10시간 전",
    source: "FAO",
  },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    경제: "bg-emerald-500/10 text-emerald-500",
    기술: "bg-blue-500/10 text-blue-500",
    정치: "bg-red-500/10 text-red-500",
    과학: "bg-purple-500/10 text-purple-500",
    건강: "bg-pink-500/10 text-pink-500",
    스포츠: "bg-orange-500/10 text-orange-500",
    문화: "bg-yellow-500/10 text-yellow-500",
  };
  return colors[category] || "bg-muted text-muted-foreground";
};

export function LatestNews() {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold">최신 뉴스</h2>
        </div>
        <Link
          href="/latest"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          더보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {latestNews.map((news, index) => (
          <Link key={news.id} href={`/news/${news.id}`}>
            <article
              className={`flex items-start gap-4 p-4 hover:bg-secondary transition-colors ${
                index !== latestNews.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(
                      news.category
                    )}`}
                  >
                    {news.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {news.source}
                  </span>
                </div>
                <h3 className="text-sm font-medium line-clamp-1 hover:text-accent transition-colors">
                  {news.title}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="h-3 w-3" />
                {news.date}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
