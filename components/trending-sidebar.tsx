// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";

// 트렌드 토픽 데이터 (다국어 지원)
const TRENDING_TOPICS = [
  { rank: 1, topic: "#PiMainnet", count: "125K" },
  { rank: 2, topic: "#OpenNetwork", count: "98K" },
  { rank: 3, topic: "#PiKYC", count: "76K" },
  { rank: 4, topic: "#PiMigration", count: "54K" },
  { rank: 5, topic: "#PiNetwork", count: "45K" },
];

// 최근 뉴스 데이터 (다국어 지원)
const RECENT_NEWS = [
  {
    id: "1",
    titleKo: "Pi Network 월간 활성 사용자 5천만 돌파",
    titleEn: "Pi Network Exceeds 50M Monthly Active Users",
    timestampKo: "30분 전",
    timestampEn: "30m ago",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    titleKo: "아시아 지역 Pi 채굴자 증가율 최고치 기록",
    titleEn: "Asia Region Records Highest Growth in Pi Miners",
    timestampKo: "1시간 전",
    timestampEn: "1h ago",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    titleKo: "Pi Browser 보안 업데이트 배포 완료",
    timestampKo: "2시간 전",
    timestampEn: "2h ago",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    titleKo: "Pi Hackathon 2026 개최 예정 발표",
    titleEn: "Pi Hackathon 2026 Announcement Released",
    timestampKo: "3시간 전",
    timestampEn: "3h ago",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop",
  },
];

// 실시간 현황 데이터 (다국어 지원)
const LIVE_STATS = [
  { labelKo: "글로벌 파이오니어", labelEn: "Global Pioneers", value: "47M+", change: "+2.3%" },
  { labelKo: "KYC 완료", labelEn: "KYC Completed", value: "42M+", change: "+1.8%" },
  { labelKo: "마이그레이션 완료", labelEn: "Migrated Wallets", value: "38M+", change: "+3.1%" },
  { labelKo: "활성 노드", labelEn: "Active Nodes", value: "12K+", change: "+0.5%" },
];

const TEXTS = {
  ko: {
    liveStatsTitle: "실시간 현황",
    trendingTitle: "실시간 트렌드",
    recentNewsTitle: "최근 뉴스",
    postsCountSuffix: "게시물",
    more: "더보기",
  },
  en: {
    liveStatsTitle: "Live Metrics",
    trendingTitle: "Trending Topics",
    recentNewsTitle: "Recent News",
    postsCountSuffix: "posts",
    more: "View More",
  },
};

export function TrendingSidebar({ currentLang }: { currentLang?: string }) {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"ko" | "en">("en");

  // 현재 앱 언어 감지
  const getAppLanguage = (): "ko" | "en" => {
    if (typeof window === "undefined") return "en";
    try {
      const savedLang =
        currentLang ||
        localStorage.getItem("language") ||
        localStorage.getItem("gpnr-language") ||
        localStorage.getItem("gpnr_lang") ||
        localStorage.getItem("pi_lang") ||
        "en";
      return savedLang.startsWith("ko") ? "ko" : "en";
    } catch {
      return "en";
    }
  };

  useEffect(() => {
    setMounted(true);
    setLang(getAppLanguage());

    const handleLangChange = () => {
      setLang(getAppLanguage());
    };

    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);

    return () => {
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("languageChange", handleLangChange);
    };
  }, [currentLang]);

  const t = TEXTS[lang] || TEXTS.en;

  if (!mounted) return null;

  return (
    <aside className="space-y-6">
      {/* Live Stats */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {t.liveStatsTitle}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {LIVE_STATS.map((stat, idx) => {
            const label = lang === "ko" ? stat.labelKo : stat.labelEn;
            return (
              <div key={idx} className="bg-secondary/60 rounded-xl p-3 border border-border/40">
                <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{label}</p>
                <p className="text-lg font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-xs text-emerald-500 font-medium">{stat.change}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          {t.trendingTitle}
        </h3>
        <div className="space-y-2">
          {TRENDING_TOPICS.map((topic) => (
            <div
              key={topic.rank}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <span className="text-sm font-bold text-muted-foreground w-5 text-center">
                {topic.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{topic.topic}</p>
                <p className="text-xs text-muted-foreground">
                  {topic.count} {t.postsCountSuffix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent News */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          {t.recentNewsTitle}
        </h3>
        <div className="space-y-3">
          {RECENT_NEWS.map((news) => {
            const title = lang === "ko" ? news.titleKo : news.titleEn;
            const time = lang === "ko" ? news.timestampKo : news.timestampEn;

            return (
              <div
                key={news.id}
                className="group flex gap-3 p-2 rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer active:scale-[0.98]"
              >
                <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50">
                  <Image
                    src={news.image}
                    alt={title}
                    fill
                    sizes="56px"
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">{time}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button 
          type="button" 
          className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors cursor-pointer"
        >
          <span>{t.more}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}

export default TrendingSidebar;
