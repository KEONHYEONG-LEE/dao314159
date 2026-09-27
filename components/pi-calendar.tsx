// @ts-nocheck
"use client";

import React, { useState } from "react";

export function PiCalendar({ currentLang = "ko" }: { currentLang?: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <section className="py-4 px-2 bg-[#0f172a] text-slate-100 min-h-[400px]">
      <div className="max-w-md mx-auto bg-[#1e293b] border border-purple-500/30 rounded-2xl p-5 shadow-2xl">
        {/* 달력 상단 헤더 */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-700/60 pb-3">
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

        {/* 요일 */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-3">
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
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {days.map((day) => {
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`py-2.5 rounded-xl font-medium transition-all ${
                  isToday
                    ? "bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/50 ring-2 ring-purple-400"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

