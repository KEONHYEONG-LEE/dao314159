"use client";

import { TrendingUp, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";

const trendingTopics = [
  { rank: 1, topic: "#PiMainnet", count: "125K" },
  { rank: 2, topic: "#OpenNetwork", count: "98K" },
  { rank: 3, topic: "#PiKYC", count: "76K" },
  { rank: 4, topic: "#PiMigration", count: "54K" },
  { rank: 5, topic: "#PiNetwork", count: "45K" },
];

const recentNews = [
  {
    id: "1",
    title: "Pi Network 월간 활성 사용자 5천만 돌파",
    timestamp: "30분 전",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    title: "아시아 지역 Pi 채굴자 증가율 최고치 기록",
    timestamp: "1시간 전",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    title: "Pi Browser 보안 업데이트 배포 완료",
    timestamp: "2시간 전",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    title: "Pi Hackathon 2026 개최 예정 발표",
    timestamp: "3시간 전",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop",
  },
];

const liveStats = [
  { label: "글로벌 파이오니어", value: "47M+", change: "+2.3%" },
  { label: "KYC 완료", value: "42M+", change: "+1.8%" },
  { label: "마이그레이션 완료", value: "38M+", change: "+3.1%" },
  { label: "활성 노드", value: "12K+", change: "+0.5%" },
];

export function TrendingSidebar() {
  return (
    <aside className="space-y-6">
      {/* Live Stats */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          실시간 현황
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {liveStats.map((stat) => (
            <div key={stat.label} className="bg-secondary rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-green-500">{stat.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          실시간 트렌드
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <div
              key={topic.rank}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              <span className="text-sm font-bold text-muted-foreground w-5">
                {topic.rank}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{topic.topic}</p>
                <p className="text-xs text-muted-foreground">{topic.count} 게시물</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent News */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          최근 뉴스
        </h3>
        <div className="space-y-3">
          {recentNews.map((news) => (
            <div
              key={news.id}
              className="group flex gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{news.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
          <span>더보기</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}
