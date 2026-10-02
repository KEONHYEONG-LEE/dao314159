// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo } from "react";

export interface CalendarEvent {
  id: string | number;
  date: string; // YYYY-MM-DD
  titleKo: string;
  titleEn: string;
  descKo?: string;
  descEn?: string;
  categoryKo: string;
  categoryEn: string;
  type: "major" | "important" | "normal";
  statusKo?: string;
  statusEn?: string;
}

// 기본 고정 일정 데이터베이스 (데이터 정제 완료)
const INITIAL_EVENTS_DATA: CalendarEvent[] = [
  {
    id: "evt-1",
    date: "2026-03-14",
    titleKo: "오픈 메인넷 로드맵 발표 (Pi Day)",
    titleEn: "Open Mainnet Roadmap Announcement",
    descKo: "코어팀의 연례 주요 성과 발표 및 메인넷 생태계 확장 비전 공개",
    descEn: "Core Team annual achievements & Open Mainnet ecosystem vision launch",
    categoryKo: "메인넷",
    categoryEn: "Mainnet",
    type: "major",
    statusKo: "진행중",
    statusEn: "In Progress",
  },
  {
    id: "evt-2",
    date: "2026-04-15",
    titleKo: "노드 버전 동기화 & 프로토콜 업그레이드",
    titleEn: "Node Version Sync & Protocol Upgrade",
    descKo: "분산 네트워크 안정성 강화를 위한 글로벌 노드 프로토콜 패치 완료",
    descEn: "Global node protocol patch for decentralized network stability",
    categoryKo: "개발",
    categoryEn: "Dev",
    type: "important",
    statusKo: "활동중",
    statusEn: "Active",
  },
  {
    id: "evt-3",
    date: "2026-06-28",
    titleKo: "GPNR 실시간 동기화 & Pi2Day 서밋",
    titleEn: "GPNR Real-time Sync & Pi2Day Summit",
    descKo: "글로벌 GCV 상점 및 온/오프라인 결제 생태계 대규모 통합 업데이트",
    descEn: "Global GCV merchant & online/offline payment ecosystem integration",
    categoryKo: "생태계",
    categoryEn: "Ecosystem",
    type: "major",
    statusKo: "실시간",
    statusEn: "Real-time",
  },
  {
    id: "evt-4",
    date: "2026-09-30",
    titleKo: "Q3 글로벌 해커톤 & DApp 연동 점검",
    titleEn: "Q3 Global Hackathon & DApp Check",
    descKo: "메인넷 유틸리티 활성화를 위한 3분기 분기별 개발 결과 평가",
    descEn: "Q3 development results evaluation for mainnet utility activation",
    categoryKo: "개발",
    categoryEn: "Dev",
    type: "normal",
    statusKo: "예정",
    statusEn: "Upcoming",
  },
  {
    id: "evt-5",
    date: "2026-12-31",
    titleKo: "메인넷 마이그레이션 최종 마감",
    titleEn: "Mainnet Migration Final Grace Period",
    descKo: "유예기간 최종 이행 상태 점검 및 메인넷 활성화 통계 발표",
    descEn: "Final Grace Period compliance audit & mainnet activation stats",
    categoryKo: "메인넷",
    categoryEn: "Mainnet",
    type: "major",
    statusKo: "대기중",
    statusEn: "Pending",
  },
];

export function PiCalendar({ currentLang }: { currentLang?: string }) {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [activeLang, setActiveLang] = useState<"ko" | "en">("ko");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [eventsData] = useState<CalendarEvent[]>(INITIAL_EVENTS_DATA);

  const getAppLanguage = (): "ko" | "en" => {
    if (typeof window === "undefined") return "ko";
    try {
      const savedLang =
        currentLang ||
        localStorage.getItem("language") ||
        localStorage.getItem("gpnr-language") ||
        "ko";
      return savedLang.startsWith("ko") ? "ko" : "en";
    } catch {
      return "ko";
    }
  };

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
    setSelectedDate("");
    setActiveLang(getAppLanguage());
  }, [currentLang]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate("");
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate("");
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthNames = {
    ko: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  };

  const weekDays = {
    ko: ["일", "월", "화", "수", "목", "금", "토"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  };

  const categories = [
    { key: "ALL", labelKo: "전체", labelEn: "All" },
    { key: "메인넷", labelKo: "메인넷", labelEn: "Mainnet" },
    { key: "개발", labelKo: "개발", labelEn: "Dev" },
    { key: "생태계", labelKo: "생태계", labelEn: "Ecosystem" },
  ];

  const getFormattedDate = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const selectedEvents = useMemo(() => {
    const currentYearMonth = `${year}-${String(month + 1).padStart(2, "0")}`;

    return eventsData
      .filter((e) => {
        const matchDate = selectedDate
          ? e.date === selectedDate
          : e.date.startsWith(currentYearMonth);

        const matchCat =
          selectedCategory === "ALL" ||
          e.categoryKo === selectedCategory ||
          e.categoryEn.toLowerCase() === selectedCategory.toLowerCase();

        return matchDate && matchCat;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedDate, selectedCategory, eventsData, year, month]);

  const calculateDDay = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "D-Day";
    return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  if (!mounted) return null;

  return (
    <section className="py-4 px-2 bg-slate-950 text-slate-100 min-h-[550px] rounded-2xl border border-slate-800 shadow-xl">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between px-1 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <h2 className="text-sm font-black text-slate-100 tracking-wide">
              {activeLang === "ko" ? "Pi 네트워크 이벤트 일정" : "Pi Network Event Schedule"}
            </h2>
          </div>
          <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700 font-bold">
            GPNR Live
          </span>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1 text-[11px] font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm border border-purple-400"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                }`}
              >
                {activeLang === "ko" ? cat.labelKo : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* 달력 그리드 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-purple-300 border border-slate-700 cursor-pointer"
            >
              ‹ {activeLang === "ko" ? "이전달" : "Prev"}
            </button>

            <h3 className="text-sm font-black text-purple-200 flex items-center gap-1.5">
              <span>🗓️</span>
              {activeLang === "ko"
                ? `${year}년 ${monthNames.ko[month]}`
                : `${monthNames.en[month]} ${year}`}
            </h3>

            <button
              type="button"
              onClick={nextMonth}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-purple-300 border border-slate-700 cursor-pointer"
            >
              {activeLang === "ko" ? "다음달" : "Next"} ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-1.5">
            {weekDays[activeLang].map((day, idx) => (
              <span
                key={day}
                className={idx === 0 ? "text-rose-400" : idx === 6 ? "text-indigo-400" : "text-slate-400"}
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {days.map((day) => {
              const fullDateStr = getFormattedDate(day);
              const todayObj = new Date();
              const isToday =
                day === todayObj.getDate() &&
                month === todayObj.getMonth() &&
                year === todayObj.getFullYear();

              const isSelected = selectedDate === fullDateStr;
              
              const matchedEvents = eventsData.filter((e) => {
                const isDateMatch = e.date === fullDateStr;
                const isCatMatch =
                  selectedCategory === "ALL" ||
                  e.categoryKo === selectedCategory ||
                  e.categoryEn.toLowerCase() === selectedCategory.toLowerCase();
                return isDateMatch && isCatMatch;
              });

              const hasMajor = matchedEvents.some((e) => e.type === "major");
              const hasEvent = matchedEvents.length > 0;

              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => {
                    if (selectedDate === fullDateStr) {
                      setSelectedDate("");
                    } else {
                      setSelectedDate(fullDateStr);
                    }
                  }}
                  className={`relative py-2.5 rounded-lg font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md ring-2 ring-purple-300 scale-105 z-10"
                      : isToday
                      ? "bg-slate-800 text-amber-300 font-black border border-amber-400/60"
                      : "bg-slate-800/40 text-slate-300 hover:bg-slate-700/60"
                  }`}
                >
                  <span>{day}</span>

                  {hasEvent && (
                    <div className="absolute bottom-1 flex gap-0.5 items-center">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          hasMajor
                            ? "bg-amber-400 shadow-[0_0_4px_#f59e0b]"
                            : "bg-purple-400"
                        }`}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 일정 리스트 목록 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📌</span>
              <h3 className="text-xs font-black text-slate-200">
                {selectedDate
                  ? `${selectedDate} ${activeLang === "ko" ? "일정" : "Scheduled Events"}`
                  : `${year}년 ${month + 1}월 ${activeLang === "ko" ? "주요 일정" : "Monthly Key Events"}`}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate("")}
                  className="text-[10px] text-purple-400 hover:underline font-semibold cursor-pointer"
                >
                  {activeLang === "ko" ? "전체보기" : "Show All"}
                </button>
              )}
              <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800 font-extrabold">
                {selectedEvents.length}{activeLang === "ko" ? "개 항목" : " item(s)"}
              </span>
            </div>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="text-center py-5 space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                {activeLang === "ko"
                  ? "해당 기간/날짜에 등록된 중요 일정이 없습니다."
                  : "No scheduled events for this period/date."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedEvents.map((evt) => {
                const isMajor = evt.type === "major";

                return (
                  <div
                    key={evt.id}
                    className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                      isMajor
                        ? "bg-gradient-to-r from-purple-950/40 to-slate-900 border-purple-500/50"
                        : "bg-slate-800/50 border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs">📍</span>
                        <h4 className="text-xs font-bold text-slate-100 truncate">
                          {activeLang === "ko" ? evt.titleKo : evt.titleEn}
                        </h4>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isMajor
                            ? "bg-purple-500/30 text-purple-200 border border-purple-400/40"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {activeLang === "ko" ? evt.statusKo : evt.statusEn}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 border-t border-white/[0.05]">
                      <span>🗓️ {evt.date} ({calculateDDay(evt.date)})</span>
                      <span className="text-purple-400 font-semibold">
                        {activeLang === "ko" ? evt.categoryKo : evt.categoryEn}
                      </span>
                    </div>

                    {(evt.descKo || evt.descEn) && (
                      <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                        {activeLang === "ko" ? evt.descKo : evt.descEn}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export { PiCalendar as piCalendar };
export default PiCalendar;
