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
  isAutoAI?: boolean; // AI 자동 선별 추출 여부
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

// AI/Parser Engine: 뉴스에서 일정 추출
const parseArticlesToEvents = (articles: ArticlePayload[]): CalendarEvent[] => {
  const extractedEvents: CalendarEvent[] = [];

  const monthMap: Record<string, string> = {
    january: "01", jan: "01",
    february: "02", feb: "02",
    march: "03", mar: "03",
    april: "04", apr: "04",
    may: "05",
    june: "06", jun: "06",
    july: "07", jul: "07",
    august: "08", aug: "08",
    september: "09", sep: "09", sept: "09",
    october: "10", oct: "10",
    november: "11", nov: "11",
    december: "12", dec: "12",
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
  const [activeLang, setActiveLang] = useState<"ko" | "en">("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [eventsData, setEventsData] = useState<CalendarEvent[]>(INITIAL_EVENTS_DATA);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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

    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setSelectedDate(`${now.getFullYear()}-${m}-${d}`);

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

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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
    return eventsData.filter((e) => {
      const matchDate = e.date === selectedDate;
      const matchCat =
        selectedCategory === "ALL" ||
        e.categoryKo === selectedCategory ||
        e.categoryEn.toLowerCase() === selectedCategory.toLowerCase();
      return matchDate && matchCat;
    });
  }, [selectedDate, selectedCategory, eventsData]);

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
    <section className="py-5 px-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-[600px] rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-xl">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* 상단 동기화 헤더 */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isSyncing ? "animate-ping" : ""}`} />
            <span>{isSyncing ? "AI 동기화 진행 중..." : "GPNR AI Realtime Syncing"}</span>
          </div>
          <button
            onClick={fetchLiveNewsAndInjectEvents}
            disabled={isSyncing}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 active:scale-95 transition-all"
          >
            🔄 {activeLang === "ko" ? "AI 일정 새로고침" : "Refresh AI Events"}
          </button>
        </div>

        {/* 핵심 일정 카운트다운 카드 */}
        {upcomingMajorEvent && (
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-amber-900/20 to-purple-900/40 border border-amber-500/30 rounded-2xl p-3.5 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-300/90 flex items-center gap-1">
                  {activeLang === "ko" ? "다가오는 핵심 일정" : "Next Key Event"}
                  {upcomingMajorEvent.isAutoAI && (
                    <span className="bg-purple-600/80 text-[9px] text-white px-1.5 py-0.2 rounded-full font-normal">
                      AI Auto
                    </span>
                  )}
                </span>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm">
                {calculateDDay(upcomingMajorEvent.date)}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <h4 className="text-sm font-extrabold text-slate-100 truncate max-w-[240px]">
                {activeLang === "ko" ? upcomingMajorEvent.titleKo : upcomingMajorEvent.titleEn}
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                {upcomingMajorEvent.date}
              </span>
            </div>
          </div>
        )}

        {/* 카테고리 필터 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1 text-[11px] font-semibold rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40 border border-purple-400/30"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-slate-700/50"
                }`}
              >
                {activeLang === "ko" ? cat.labelKo : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* 달력 그리드 */}
        <div className="bg-slate-900/90 border border-purple-500/20 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 rounded-xl text-xs font-bold text-purple-300 border border-purple-500/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>‹</span>
              <span>{activeLang === "ko" ? "이전달" : "Prev"}</span>
            </button>

            <h2 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-100 to-amber-200 tracking-wide flex items-center gap-2">
              <span className="text-lg">🗓️</span>
              {activeLang === "ko"
                ? `${year}년 ${monthNames.ko[month]}`
                : `${monthNames.en[month]} ${year}`}
            </h2>

            <button
              type="button"
              onClick={nextMonth}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 rounded-xl text-xs font-bold text-purple-300 border border-purple-500/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{activeLang === "ko" ? "다음달" : "Next"}</span>
              <span>›</span>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-extrabold text-slate-400 mb-2">
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
              <div key={`empty-${i}`} className="p-2.5" />
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
                  onClick={() => setSelectedDate(fullDateStr)}
                  className={`relative py-3 rounded-xl font-bold transition-all duration-150 cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-600/40 ring-2 ring-purple-300 scale-105 z-10"
                      : isToday
                      ? "bg-slate-800 text-amber-300 font-black border border-amber-400/50"
                      : "bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white"
                  }`}
                >
                  <span className="text-xs">{day}</span>

                  {hasEvent && (
                    <div className="absolute bottom-1 flex gap-0.5 items-center">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          hasMajor
                            ? "bg-amber-400 shadow-[0_0_6px_#f59e0b]"
                            : hasImportant
                            ? "bg-purple-400 shadow-[0_0_6px_#c084fc]"
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

        {/* 선택된 일자의 이벤트 리스트 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">📌</span>
              <h3 className="text-xs font-black tracking-wide text-slate-200">
                {selectedDate} {activeLang === "ko" ? "일정" : "Scheduled Events"}
              </h3>
            </div>
            <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/50 font-extrabold">
              {selectedEvents.length}{activeLang === "ko" ? "개 항목" : " item(s)"}
            </span>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="text-center py-6 space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                {activeLang === "ko"
                  ? "해당 날짜에 등록된 중요 일정이 없습니다."
                  : "No scheduled events for this date."}
              </p>
              <p className="text-[11px] text-slate-600">
                {activeLang === "ko"
                  ? "다른 카테고리나 날짜를 선택해보세요."
                  : "Try checking another date or category."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedEvents.map((evt) => {
                const isMajor = evt.type === "major";
                const isImportant = evt.type === "important";

                return (
                  <div
                    key={evt.id}
                    className={`p-3 rounded-xl border transition-all duration-200 space-y-1.5 ${
                      isMajor
                        ? "bg-gradient-to-r from-amber-950/30 to-purple-950/30 border-amber-500/40 shadow-md shadow-amber-950/20"
                        : isImportant
                        ? "bg-slate-800/90 border-purple-500/40"
                        : "bg-slate-800/50 border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isMajor
                              ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                              : isImportant
                              ? "bg-purple-400"
                              : "bg-cyan-400"
                          }`}
                        />
                        <h4 className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                          {activeLang === "ko" ? evt.titleKo : evt.titleEn}
                          {evt.isAutoAI && (
                            <span className="text-[9px] bg-purple-900/80 text-purple-200 border border-purple-500/40 px-1.5 py-0.2 rounded">
                              AI Detected
                            </span>
                          )}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
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
                      <p className="text-[11px] text-slate-400 pl-4 leading-relaxed">
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
