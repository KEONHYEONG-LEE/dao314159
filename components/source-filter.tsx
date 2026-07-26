"use client";

import { Tv, Youtube, Twitter, Facebook, Instagram, Rss, Filter, LucideIcon } from "lucide-react";

interface NewsSource {
  id: string;
  label: string;
  icon: LucideIcon; // 타입을 LucideIcon으로 명확하게 지정했습니다.
  color: string;
  bgColor: string;
  channels?: string[];
}

const sources: NewsSource[] = [
  {
    id: "all",
    label: "전체 소스",
    icon: Filter,
    color: "text-muted-foreground",
    bgColor: "bg-secondary",
  },
  {
    id: "official",
    label: "공식 뉴스",
    icon: Tv,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    channels: ["CNN", "BBC", "KBS", "Reuters", "Bloomberg"],
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    bgColor: "bg-red-600/10",
    channels: ["Pi Network", "호알라TV", "코인투자", "크립토뉴스"],
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    icon: Twitter,
    color: "text-foreground",
    bgColor: "bg-secondary",
    channels: ["@PiCoreTeam", "@PiNetwork", "@니콜라스"],
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    channels: ["Pi Network Official", "Pi Korea"],
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    channels: ["@pinetwork", "@pi_korea"],
  },
  {
    id: "rss",
    label: "RSS 피드",
    icon: Rss,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    channels: ["CoinDesk", "CoinTelegraph"],
  },
];

interface SourceFilterProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

export function SourceFilter({ selectedSource, onSourceChange }: SourceFilterProps) {
  const activeSource = sources.find((s) => s.id === selectedSource);

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Filter className="w-4 h-4 text-primary" />
        뉴스 소스
      </h3>
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => {
          const Icon = source.icon;
          const isSelected = selectedSource === source.id;
          return (
            <button
              key={source.id}
              onClick={() => onSourceChange(source.id)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md"
                  : `${source.bgColor} text-secondary-foreground hover:opacity-80`
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-primary-foreground" : source.color}`} />
              <span>{source.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Active Source Channels */}
      {selectedSource !== "all" && activeSource?.channels && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">수집 중인 채널:</p>
          <div className="flex flex-wrap gap-1">
            {activeSource.channels.map((channel) => (
              <span
                key={channel}
                className="px-2 py-1 bg-secondary rounded-md text-xs text-muted-foreground"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
