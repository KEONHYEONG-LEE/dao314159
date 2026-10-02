import React, { useEffect, useState } from 'react';

interface EventItem {
  id: string;
  titleKo: string;
  titleEn: string;
  statusKo: string;
  statusEn: string;
  badgeType?: 'purple' | 'blue' | 'green';
}

interface PiCalendarProps {
  lang?: 'ko' | 'en';
}

export const PiCalendar: React.FC<PiCalendarProps> = ({ lang = 'ko' }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await fetch('/api/pi-events');
        const data = await res.json();
        if (data.success && data.events) {
          setEvents(data.events);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'purple':
        return 'bg-purple-900/50 text-purple-300 border-purple-500/30';
      case 'blue':
        return 'bg-blue-900/50 text-blue-300 border-blue-500/30';
      case 'green':
        return 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl bg-[#131522] border border-gray-800 shadow-lg text-white">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
          📅
        </div>
        <h3 className="text-lg font-bold">
          {lang === 'ko' ? 'Pi 네트워크 이벤트 일정' : 'Pi Network Schedule'}
        </h3>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        {lang === 'ko'
          ? 'AI가 실시간 뉴스 및 공지에서 최신 파이 네트워크 주요 일정을 수집합니다.'
          : 'AI dynamically aggregates key Pi Network schedules from live news.'}
      </p>

      {/* 이벤트 리스트 */}
      {loading ? (
        <div className="py-8 text-center text-sm text-gray-500 animate-pulse">
          {lang === 'ko' ? '최신 일정을 AI가 분석 중입니다...' : 'Analyzing schedule with AI...'}
        </div>
      ) : (
        <div className="space-y-2.5">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[#1a1d2e] border border-gray-800/80 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-red-400 text-sm">📍</span>
                <span className="text-xs font-medium text-gray-200">
                  {lang === 'ko' ? event.titleKo : event.titleEn}
                </span>
              </div>
              <span
                className={`text-[11px] px-2.5 py-1 rounded-md border font-semibold ${getBadgeStyle(
                  event.badgeType
                )}`}
              >
                {lang === 'ko' ? event.statusKo : event.statusEn}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PiCalendar;
