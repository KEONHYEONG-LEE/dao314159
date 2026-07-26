"use client"; 

import { Tv, Youtube, Twitter, Facebook, Instagram, Rss, Filter } from "lucide-react"; 

const sources = [
  { id: "all", label: "전체 소스", icon: Filter, color: "text-gray-500", bgColor: "bg-gray-100" },
  { id: "official", label: "공식 뉴스", icon: Tv, color: "text-red-500", bgColor: "bg-red-50", channels: ["CNN", "BBC", "Reuters"] },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600", bgColor: "bg-red-50", channels: ["Pi Network", "HoalaTV"] },
  { id: "twitter", label: "X", icon: Twitter, color: "text-black", bgColor: "bg-gray-100", channels: ["@PiCoreTeam"] }
]; 

export function SourceFilter({ 
  selectedSource, 
  onSourceChange 
}: { 
  selectedSource: string; 
  onSourceChange: (source: string) => void; 
}) {
  const activeSource = sources.find((s) => s.id === selectedSource); 

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Filter className="w-4 h-4 text-blue-600" />
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : `${source.bgColor} ${source.color}`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{source.label}</span>
            </button>
          );
        })}
      </div> 

      {selectedSource !== "all" && activeSource?.channels && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1">
          {activeSource.channels.map((ch) => (
            <span key={ch} className="px-2 py-0.5 bg-gray-50 rounded text-[10px] text-gray-500 border border-gray-100">
              {ch}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
