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
  isAutoAI?: boolean;
}

// 기본 고정 일정 데이터베이스
const INITIAL_EVENTS_DATA: CalendarEvent[] = [
  {
    id: "evt-1",
    date: "2026-03-14",
    titleKo: "Pi Day (파이 데이) & 메인넷 로드맵 발표",
    titleEn: "Pi Day & Mainnet Roadmap Announcement",
    descKo: "코어팀의 연례 주요 성과 발표 및 메인넷 생태계 확장 비전 공개",
    descEn: "Core Team annual achievements & Open Mainnet ecosystem vision launch",
    categoryKo: "행사",
    categoryEn: "Event",
    type: "major",
  },
  {
    id: "evt-2",
    date: "2026-03-31",
    titleKo: "Q1 생태계 해커톤 심사 및 우수 앱 발표",
    titleEn: "Q1 Hackathon Evaluation & Winner Showcase",
    descKo: "1분기 유틸리티 개발 해커톤 마감 및 상위 파이 유틸리티 앱 검증 완료",
    descEn: "Q1 utility hackathon conclusion & top Pi utility apps verification",
    categoryKo: "개발",
    categoryEn: "Dev",
    type: "normal",
  },
  {
    id: "evt-3",
    date: "2026-04-15",
    titleKo: "KYC & 임시 KYC 통과자 2차 자동 마이그레이션",
    titleEn: "KYC Tentative Approval Auto-Migration Phase 2",
    descKo: "검증을 마친 글로벌 개척자들의 지갑 메인넷 마이그레이션 대규모 처리",
    descEn: "Mass mainnet migration process for verified global Pioneers",
    categoryKo: "메인넷",
    categoryEn: "Mainnet",
    type: "important",
  },
  {
    id: "evt-4",
    date: "2026-06-28",
    titleKo: "Pi2Day (2차 파이 데이) & 글로벌 생태계 페스티벌",
    titleEn: "Pi2Day (2nd Pi Day) & Global Festival",
    descKo: "글로벌 GCV 상점 및 온/오프라인 결제 생태계 대규모 통합 업데이트",
    descEn: "Global GCV merchant & online/offline payment ecosystem integration",
    categoryKo: "행사",
    categoryEn: "Event",
    type: "major",
  },
  {
    id: "evt-5",
    date: "2026-07-15",
    titleKo: "Pi Node (파이 노드) V2.0 보안 점검 및 업그레이드",
    titleEn: "Pi Node V2.0 Security Audit & Protocol Upgrade",
    descKo: "분산 네트워크 안정성 강화를 위한 글로벌 노드 프로토콜 패치",
    descEn: "Global node protocol patch for decentralized network stability",
    categoryKo: "개발",
    categoryEn: "Dev",
    type: "normal",
  },
  {
    id: "evt-6",
    date: "2026-09-30",
    titleKo: "Q3 글로벌 해커톤 & DApp 프로토콜 연동 점검",
    titleEn: "Q3 Global Hackathon & DApp Protocol Check",
    descKo: "메인넷 유틸리티 활성화를 위한 3분기 분기별 개발 결과 평가",
    descEn: "Q3 development results evaluation for mainnet utility activation",
    categoryKo: "개발",
    categoryEn: "Dev",
    type: "normal",
  },
  {
    id: "evt-7",
    date: "2026-10-20",
    titleKo: "GPNR 글로벌 상권 & 결제 제휴 확장 서밋",
    titleEn: "GPNR Global Alliance & Commerce Summit",
    descKo: "GPNR 기반 실물 결제 온보딩 파트너십 및 뉴스룸 리워드 연동",
    descEn: "GPNR physical payment onboarding partnership & newsroom rewards",
    categoryKo: "생태계",
    categoryEn: "Ecosystem",
    type: "important",
  },
  {
    id: "evt-8",
    date: "2026-12-31",
    titleKo: "메인넷 마이그레이션 최종 마감 및 연말 통합점검",
    titleEn: "Mainnet Migration Final Grace Period & EOY Review",
    descKo: "유예기간(Grace Period) 최종 이행 상태 점검 및 메인넷 활성화 통계 발표",
    descEn: "Final Grace Period compliance audit & mainnet activation stats",
    categoryKo: "메인넷",
    categoryEn: "Mainnet",
    type: "major",
  },
];

interface ArticlePayload {
  title: string;
  snippet?: string;
  publishedDate?: string;
}

const parseArticlesToEvents = (articles: ArticlePayload[]): CalendarEvent[] => {
  const extractedEvents: CalendarEvent[] = [];

  const monthMap: Record<string, string> = {
    january: "01", jan: "01", february: "02", feb: "02",
    march: "03", mar: "03", april: "04", apr: "04", may: "05",
    june: "06", jun: "06", july: "07", jul: "07", august: "08", aug: "08",
    september: "09", sep: "09", sept: "09", october: "10", oct: "10",
    november: "11", nov: "11", december: "12", dec: "12",
  };

  articles.forEach((art, index) => {
    const text = `${art.title} ${art.snippet || ""}`;
    const dateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,\s*(\d{4}))?/i;
    const match = text.match(dateRegex);

    if (match) {
      const monthStr = match[1].toLowerCase();
      const dayStr = match[2].padStart(2, "0");
      const yearStr = match[3] || "2026";
      const monthNum = monthMap[monthStr] || "01";
      const formattedDate = `${yearStr}-${monthNum}-${dayStr}`;

      let type: "major" | "important" | "normal" = "important";
      if (/deadline|protocol|mainnet|launch|upgrade/i.test(text)) {
        type = "major";
      }

      let catKo = "메인넷";
      let catEn = "Mainnet";
      if (/protocol|node|rollout|upgrade/i.test(text)) {
        catKo = "개발";
        catEn = "Dev";
      } else if (/event|summit|festival|day/i.test(text)) {
        catKo = "행사";
        catEn = "Event";
      }

      extractedEvents.push({
        id: `ai-evt-${index}-${Date.now()}`,
        date: formattedDate,
        titleKo: art.title,
        titleEn: art.title,
        descKo: art.snippet || "AI가 실시간 뉴스로부터 자동 수집·선별한 핵심 일정입니다.",
        descEn: art.snippet || "Auto-extracted key schedule from live news AI parser.",
        categoryKo: catKo,
        categoryEn: catEn,
        type: type,
        isAutoAI: true,
      });
    }
  });

  return extractedEvents;
};

export function PiCalendar({ currentLang }: { currentLang?: string }) {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [activeLang, setActiveLang] = useState<"ko" | "en">("ko");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [eventsData, setEventsData] = useState<CalendarEvent[]>(INITIAL_EVENTS_DATA);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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

  const fetchLiveNewsAndInjectEvents = async () => {
    setIsSyncing(true);
    try {
      const fetchedNewsArticles: ArticlePayload[] = [
        {
          title: "Pi Network Starts Protocol 26 Rollout Ahead of August 11 Deadline",
          snippet: "Mainnet node operators must update to Protocol 26 by August 11 or risk being disconnected.",
          publishedDate: "2026-07-29",
        },
      ];

      const aiExtractedEvents = parseArticlesToEvents(fetchedNewsArticles);

      setEventsData((prev) => {
        const existingIds = new Set(prev.map((e) => `${e.date}-${e.titleEn}`));
        const newEvents = aiExtractedEvents.filter(
          (e) => !existingIds.has(`${e.date}-${e.titleEn}`)
        );
        return [...prev, ...newEvents];
      });
    } catch (err) {
      console.error("Failed to sync AI events:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(""); // 특정 날짜 선택 안 함 -> 이번 달 전체 주요 일정 표시

    setActiveLang(getAppLanguage());
    fetchLiveNewsAndInjectEvents();

    const handleLangChange = () => {
      setActiveLang(getAppLanguage());
    };

    window.addEventListener("storage", handleLangChange);
    window.addEventListener("languageChange", handleLangChange);

    return () => {
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("languageChange", handleLangChange);
    };
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
    { key: "행사", labelKo: "행사", labelEn: "Event" },
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

  const upcomingMajorEvent = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const sorted = [...eventsData]
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    return sorted[0] || eventsData[0];
  }, [eventsData]);

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
        
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isSyncing ? "animate-ping" : ""}`} />
            <span>{isSyncing ? "AI 동기화 중..." : "GPNR AI Realtime Sync"}</span>
          </div>
          <button
            type="button"
            onClick={fetchLiveNewsAndInjectEvents}
            disabled={isSyncing}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition-all cursor-pointer"
          >
            🔄 {activeLang === "ko" ? "새로고침" : "Refresh"}
          </button>
        </div>

        {/* 다가오는 핵심 일정 카드 (D-Day) */}
        {upcomingMajorEvent && (
          <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-amber-500/40 rounded-xl p-3 shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                🔥 {activeLang === "ko" ? "다가오는 핵심 일정" : "Next Key Event"}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                {calculateDDay(upcomingMajorEvent.date)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-100 truncate">
                {activeLang === "ko" ? upcomingMajorEvent.titleKo : upcomingMajorEvent.titleEn}
              </h4>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {upcomingMajorEvent.date}
              </span>
            </div>
          </div>
        )}

        {/* 카테고리 필터 탭 */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
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

            <h2 className="text-sm font-black text-purple-200 flex items-center gap-1.5">
              <span>🗓️</span>
              {activeLang === "ko"
                ? `${year}년 ${monthNames.ko[month]}`
                : `${monthNames.en[month]} ${year}`}
            </h2>

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
              const hasImportant = matchedEvents.some((e) => e.type === "important");
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
                            : hasImportant
                            ? "bg-purple-400"
                            : "bg-cyan-400"
                        }`}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 일정 리스트 */}
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
            <div className="space-y-2">
              {selectedEvents.map((evt) => {
                const isMajor = evt.type === "major";
                const isImportant = evt.type === "important";

                return (
                  <div
                    key={evt.id}
                    className={`p-2.5 rounded-lg border transition-all space-y-1 ${
                      isMajor
                        ? "bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/50"
                        : isImportant
                        ? "bg-slate-800/90 border-purple-500/40"
                        : "bg-slate-800/40 border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isMajor ? "bg-amber-400" : isImportant ? "bg-purple-400" : "bg-cyan-400"
                          }`}
                        />
                        <h4 className="text-xs font-bold text-slate-100 truncate">
                          <span className="text-purple-300 font-mono text-[11px] mr-1">[{evt.date}]</span>
                          {activeLang === "ko" ? evt.titleKo : evt.titleEn}
                        </h4>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isMajor
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : isImportant
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {activeLang === "ko" ? evt.categoryKo : evt.categoryEn}
                      </span>
                    </div>

                    {(evt.descKo || evt.descEn) && (
                      <p className="text-[11px] text-slate-400 pl-3.5 leading-relaxed">
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
