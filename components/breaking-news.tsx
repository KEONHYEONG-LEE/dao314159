"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

const breakingNews = [
  "속보: Pi Network 오픈 메인넷 전환 일정 공식 발표",
  "속보: 글로벌 기후 정상회담, 탄소중립 2040 합의 도출",
  "속보: 미국 연준, 기준금리 0.25%p 인하 결정",
  "속보: WHO, 신종 감염병 경계 수준 상향 조정",
];

export function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-destructive/10 border-y border-destructive/20">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
            <span className="text-xs font-bold text-destructive uppercase tracking-wider">
              속보
            </span>
          </div>
          <div className="relative overflow-hidden flex-1">
            <p className="text-sm font-medium truncate animate-marquee">
              {breakingNews[currentIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
