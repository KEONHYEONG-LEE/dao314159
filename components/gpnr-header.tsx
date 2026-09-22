// @ts-nocheck
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { NEWS_CATEGORIES } from "../lib/categories";

// Lucide 아이콘 임포트 (드롭다운 메뉴용 Menu, 달력용 Calendar)
import {
  Menu,
  Calendar
} from "lucide-react";

// 카테고리 ID별 Lucide 아이콘 매핑 테이블 (달력을 제외한 모든 아이콘을 Menu로 통일)
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "top-news": Menu,
  "mainnet": Menu,
  "node": Menu,
  "mining": Menu,
  "wallet": Menu,
  "browser": Menu,
  "roadmap": Menu,
  "whitepaper": Menu,
  "community": Menu,
  "commerce": Menu,
  "kyc": Menu,
  "developer": Menu,
  "realestate": Menu,
  "price-prediction": Menu,
  "price": Menu,
  "security": Menu,
  "regulation": Menu,
  "calendar": Calendar // 달력 아이콘은 그대로 유지
};

interface GpnrHeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
  currentLanguage?: string;                     
}

export function GpnrHeader({ 
  currentCategory = "top-news",
  onCategoryChange,
  currentLanguage
}: GpnrHeaderProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false); 
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false); 
  const [currentLang, setCurrentLang] = useState<string>("ko");

  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();

  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(8);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setCalendarYear(now.getFullYear());
    setCalendarMonth(now.getMonth());

    const syncLanguage = () => {
      try {
        if (typeof window !== "undefined") {
          const targetLang = currentLanguage || localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "ko";
          setCurrentLang(targetLang);
        }
      } catch (e) {
        console.error("Language sync error:", e);
      }
    };

    syncLanguage();
    window.addEventListener("storage", syncLanguage);
    window.addEventListener("languageChange", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener("languageChange", syncLanguage);
    };
  }, [currentLanguage]);

  const { daysArray, startBlankDays } = useMemo(() => {
    const firstDayInstance = new Date(calendarYear, calendarMonth, 1);
    const startDayOfWeek = firstDayInstance.getDay(); 
    const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    return {
      startBlankDays: Array(startDayOfWeek).fill(null),
      daysArray: Array.from({ length: totalDaysInMonth }, (_, i) => i + 1)
    };
  }, [calendarYear, calendarMonth]);

  const handlePrevMonth = (): void => {
    if (calendarMonth === 0) {
      setCalendarYear(calendarYear - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = (): void => {
    if (calendarMonth === 11) {
      setCalendarYear(calendarYear + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleDonation = useCallback(async () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      try {
        const origin = window.location.origin;

        await (window as any).Pi.createPayment({
          amount: 0.01,
          memo: currentLang === "ko" ? "GPNR 서비스 후원" : "GPNR Service Donation",
          metadata: { type: "one-time-donation", app: "GPNR" }
        }, {
          onReadyForServerApproval: async (paymentId: string) => {
            const res = await fetch(`${origin}/api/payments/approve`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ paymentId }) 
            });

            if (!res.ok) {
              throw new Error("Payment approval failed on server.");
            }
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            const res = await fetch(`${origin}/api/payments/complete`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ paymentId, txid }) 
            });

            if (!res.ok) {
              throw new Error("Payment completion failed on server.");
            }
            alert(currentLang === "ko" ? "0.01 Pi 후원이 완료되었습니다. 감사합니다!" : "0.01 Pi donation completed. Thank you!");
          },
          onCancel: (paymentId: string) => console.log("[Pi Payment] 취소:", paymentId),
          onError: (error: Error) => console.error("[Pi Payment] 에러:", error),
        });
      } catch (err) {
        console.error("Pi SDK payment failed:", err);
      }
    } else {
      alert(currentLang === "ko" ? "Pi Browser에서 접속해 주세요." : "Please access through Pi Browser.");
    }
  }, [currentLang]);

  // 카테고리 및 달력 메뉴 목록 구성
  const LAUNCHER_ITEMS = useMemo(() => {
    const rawCategories = Array.isArray(NEWS_CATEGORIES) ? NEWS_CATEGORIES : [];
    
    const items = rawCategories.map((cat) => {
      // ID 기반 매핑을 최우선 적용, 없으면 기본적으로 Menu 아이콘 지정
      const MappedIcon = CATEGORY_ICON_MAP[cat.id] || Menu;

      return {
        id: cat.id,
        label: cat.name || cat.label || cat.id,
        enLabel: cat.enName || cat.enLabel || cat.id,
        IconComponent: MappedIcon
      };
    });

    // 달력 항목 추가
    items.push({
      id: "calendar",
      label: "달력",
      enLabel: "Calendar",
      IconComponent: Calendar
    });

    return items;
  }, []);

  const displayId = user?.username
    ? user.username.length > 12
      ? `${user.username.substring(0, 5)}...${user.username.substring(user.username.length - 4)}`
      : user.username
    : "";

  return (
    <>
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/80 border-b border-slate-800 backdrop-blur-xl transition-colors notranslate">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-[44px] items-center justify-between">
            {/* 로고 영역 */}
            <div className="flex items-center gap-2">
              <span 
                className="font-black text-lg tracking-tighter cursor-pointer" 
                style={{ animation: 'gpnr-lighting 14s steps(1) infinite' }}
                onClick={() => onCategoryChange && onCategoryChange("top-news")}
              >
                GPNR
                <style>{`
                  @keyframes gpnr-lighting {
                    0%, 100% { color: #6b0b8c; text-shadow: 0 0 12px rgba(107, 11, 140, 0.5); }
                    14.2% { color: #ef4444; text-shadow: none; }
                    28.4% { color: #f59e0b; text-shadow: none; }
                    42.6% { color: #eab308; text-shadow: none; }
                    56.8% { color: #22c55e; text-shadow: none; }
                    71.0% { color: #3b82f6; text-shadow: none; }
                    85.2% { color: #a855f7; text-shadow: none; }
                  }
                `}</style>
              </span>
            </div>
            
            {/* 우측 상단 후원 / 메뉴 햄버거 / ID 정보 */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDonation} 
                className="flex items-center gap-0.5 bg-[#f7a145]/20 text-[#f7a145] px-2 py-0.5 rounded-full border border-[#f7a145]/30 hover:bg-[#f7a145]/30 transition-colors text-[10px] font-bold"
              >
                <span>π</span>
                <span>0.01 후원</span>
              </button>

              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`px-2 py-1 rounded-lg text-lg font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                ☰
              </button>

              {mounted && isAuthenticated && user ? (
                <div className="flex items-center gap-1.5 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded-lg text-[10px] font-mono text-purple-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{displayId}</span>
                </div>
              ) : (
                <div className="text-[10px] text-amber-400 bg-amber-950/30 border border-amber-800/40 px-2 py-0.5 rounded-lg font-medium">
                  🔑 ID 미인증
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 카테고리 그리드 런처 팝업 */}
      {isLauncherOpen && (
        <div className="fixed top-[49px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {LAUNCHER_ITEMS.map((item) => {
              const isSelected = currentCategory === item.id;
              const IconComp = item.IconComponent;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "calendar") { 
                      setIsCalendarOpen(true); 
                    } else { 
                      if (onCategoryChange) onCategoryChange(item.id); 
                    }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  {/* Lucide SVG 컴포넌트 출력 */}
                  <IconComp className={`w-6 h-6 mb-1 shrink-0 transition-transform group-hover:scale-110 ${item.id === 'calendar' ? 'text-rose-400' : isSelected ? 'text-[#deff9a]' : 'text-slate-300'}`} />
                  
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full whitespace-nowrap">
                    {currentLang === "ko" ? item.label : item.enLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {isAuthenticated && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  if (logout) logout();
                  setIsLauncherOpen(false);
                }}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl transition-colors"
              >
                {currentLang === "ko" ? "KYC ID 해제 및 다시 입력" : "Reset KYC ID"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 달력 모달 팝업 */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>{currentLang === "ko" ? "달력 (Calendar)" : "Calendar"}</span>
              </h3>
              <button onClick={() => setIsCalendarOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded hover:bg-slate-800">✕</button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-black text-[#deff9a] flex items-center gap-1">
                  {currentLang === "ko" ? (
                    <><span>{calendarYear}</span>년 <span>{calendarMonth + 1}</span>월</>
                  ) : (
                    <><span>{new Date(calendarYear, calendarMonth).toLocaleString("en-US", { month: "long" })}</span> <span>{calendarYear}</span></>
                  )}
                </div>
                <div className="flex gap-3 text-sm text-slate-400">
                  <button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">◀</button>
                  <button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">▶</button>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
                {currentLang === "ko" ? (
                  <><div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div></>
                ) : (
                  <><div className="text-red-400">SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div className="text-blue-400">SAT</div></>
                )}
              </div>
              <div className="grid grid-cols-7 text-center gap-y-2 text-xs text-slate-300">
                {startBlankDays.map((_, index) => <div key={`blank-${index}`} className="text-slate-700"></div>)}
                {daysArray.map((day) => {
                  const today = new Date();
                  const isToday = today.getDate() === day && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;
                  return (
                    <div key={`day-${day}`} className="flex items-center justify-center">
                      {isToday ? <div className="bg-[#f7a145] text-slate-950 font-black rounded-full w-6 h-6 flex items-center justify-center shadow-md">{day}</div> : <span className="w-6 h-6 flex items-center justify-center">{day}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-[#f7a145] font-semibold mb-1">
                  <span className="w-1.5 h-1.5 bg-[#f7a145] rounded-full"></span>
                  <span>{currentLang === "ko" ? "[안내]" : "[Notice]"}</span>
                </div>
                <p className="pl-3.5">
                  {currentLang === "ko" 
                    ? "· 파이 네트워크 글로벌 에코시스템 뉴스 카운트다운 연동 중" 
                    : "· Pi Network Global Ecosystem News countdown is in sync"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
