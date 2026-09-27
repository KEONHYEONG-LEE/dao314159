// @ts-nocheck
"use client"; 

import React, { useState, useEffect } from "react";
import { Tv, Youtube, Twitter, Filter } from "lucide-react"; 

// 소스 데이터 정의 (다국어 키 추가)
const SOURCES = [
  { id: "all", labelKo: "전체 소스", labelEn: "All Sources", icon: Filter, color: "text-gray-500 dark:text-gray-400", bgColor: "bg-gray-100 dark:bg-gray-800" },
  { id: "official", labelKo: "공식 뉴스", labelEn: "Official News", icon: Tv, color: "text-red-500 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/40", channels: ["CNN", "BBC", "Reuters", "Bloomberg"] },
  { id: "youtube", labelKo: "YouTube", labelEn: "YouTube", icon: Youtube, color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/40", channels: ["Pi Network", "HoalaTV", "GPNR TV"] },
  { id: "twitter", labelKo: "X (트위터)", labelEn: "X (Twitter)", icon: Twitter, color: "text-slate-900 dark:text-slate-100", bgColor: "bg-gray-100 dark:bg-gray-800", channels: ["@PiCoreTeam", "@PiNews"] }
]; 

export function SourceFilter({ 
  selectedSource, 
  onSourceChange,
  currentLang
}: { 
  selectedSource: string; 
  onSourceChange: (source: string) => void;
  currentLang?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"ko" | "en">("en");

  // 앱 설정 언어 감지
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

  const activeSource = SOURCES.find((s) => s.id === selectedSource); 

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-colors">
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        {lang === "ko" ? "뉴스 소스" : "News Source"}
      </h3>

      <div className="flex flex-wrap gap-2">
        {SOURCES.map((source) => {
          const Icon = source.icon;
          const isSelected = selectedSource === source.id;
          const label = lang === "ko" ? source.labelKo : source.labelEn;

          return (
            <button
              type="button"
              key={source.id}
              onClick={() => onSourceChange(source.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? "bg-purple-600 dark:bg-purple-600 text-white shadow-sm"
                  : `${source.bgColor}${source.color} hover:opacity-80`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div> 

      {selectedSource !== "all" && activeSource?.channels && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-1.5 animate-in fade-in">
          {activeSource.channels.map((ch) => (
            <span 
              key={ch} 
              className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800/80 rounded text-[10px] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700/50 font-medium"
            >
              {ch}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SourceFilter;
