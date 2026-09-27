// @ts-nocheck
"use client";

import React, { useState } from "react";

// Pi Network 및 관련 주요 일정 데이터 (동적 관리 가능)
const EVENTS_DATA = [
  { id: 1, date: "2026-03-14", title: "Pi Day (파이 데이) & 주요 발표", category: "행사", type: "major" },
  { id: 2, date: "2026-06-28", title: "Pi2Day (2차 파이 데이)", category: "행사", type: "major" },
  { id: 3, date: "2026-09-30", title: "Pi 해커톤 분기별 결과 발표", category: "개발", type: "normal" },
  { id: 4, date: "2026-12-31", title: "메인넷 마이그레이션 점검", category: "메인넷", type: "important" },
];

export function PiCalendar({ currentLang = "ko" }: { currentLang?: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

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
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
  };

  const weekDays = {
    ko: ["일", "월", "화", "수", "목", "금", "토"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  };

  const activeLang = currentLang === "ko" ? "ko" : "en";

  // 선택된 날짜 문자열 계산 (YYYY-MM-DD)
  const getFormattedDate = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // 해당 월의 이벤트 필터링
  const currentMonthEvents = EVENTS_DATA.filter((e) => {
    const [eYear, eMonth] = e.date.split("-");
    return parseInt(eYear) === year && parseInt(eMonth) === month + 1;
  });

  // 선택된 날짜의 이벤트
  const selectedEvents = EVENTS_DATA.filter((e) => e.date === selectedDate);

  return (
    <section className="py-4 px-2 bg-[#0f172a] text-slate-100 min-h-[500px]">
      <div className="max-w-md mx-auto space-y-4">
        {/* 달력 카드 */}
        <div className="bg-[#1e293b] border border-purple-500/30 rounded-2xl p-4 shadow-2xl">
          {/* 헤더 (월 이동) */}
          <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
            <button
              onClick={prevMonth}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-purple-400 transition-colors active:scale-95"
            >
              &lt; {activeLang === "ko" ? "이전달" : "Prev"}
            </button>

            <h2 className="text-base font-bold text-purple-200 tracking-wide flex items-center gap-2">
              <span>📅</span>
              {activeLang === "ko"
                ? `${year}년 ${monthNames.ko[month]}`
                : `${monthNames.en[month]} ${year}`}
            </h2>

            <button
              onClick={nextMonth}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-purple-400 transition-colors active:scale-95"
            >
              {activeLang === "ko" ? "다음달" : "Next"} &gt;
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
            {weekDays[activeLang].map((day, idx) => (
              <span
                key={day}
                className={idx === 0 ? "text-rose-400" : idx === 6 ? "text-blue-400" : ""}
              >
                {day}
              </span>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {days.map((day) => {
              const fullDateStr = getFormattedDate(day);
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              const isSelected = selectedDate === fullDateStr;
              const hasEvent = EVENTS_DATA.some((e) => e.date === fullDateStr);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(fullDateStr)}
                  className={`relative py-2.5 rounded-xl font-medium transition-all ${
                    isSelected
                      ? "bg-purple-600 text-white font-bold ring-2 ring-purple-300 shadow-lg"
                      : isToday
                      ? "bg-slate-700 text-purple-300 font-bold border border-purple-500/50"
                      : "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span>{day}</span>

                  {/* 이벤트 존재 시 상단 점 표시 */}
                  {hasEvent && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 선택한 날짜 및 해당 월 이벤트 목록 */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between border-b border-slate-700/50 pb-2">
            <span>📌 {selectedDate} {activeLang === "ko" ? "일정" : "Events"}</span>
            <span className="text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full">
              {selectedEvents.length}개
            </span>
          </h3>

          {selectedEvents.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              {activeLang === "ko" ? "등록된 일정이 없습니다." : "No scheduled events."}
            </p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-xs font-semibold text-slate-200">{evt.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    {evt.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
