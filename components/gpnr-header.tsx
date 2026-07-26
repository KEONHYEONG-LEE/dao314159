// @ts-nocheck
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
// [핵심] 공통 파이 인증 훅 연결 (undefined 알림 유발하는 PiLogin 제거)
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";

interface GpnrHeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
  currentLanguage?: string;                     
}

interface LauncherItem {
  id: string;
  icon: string;
  label: string;
  enLabel: string;
}

export function GpnrHeader({ 
  currentCategory = "all", 
  onCategoryChange,
  currentLanguage
}: GpnrHeaderProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false); 
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false); 
  const [currentLang, setCurrentLang] = useState<string>("en");

  // 공통 Pi 인증 상태 및 로그아웃/ID 재설정 함수
  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();

  const localToday = useMemo(() => new Date(), []);
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(4);

  useEffect(() => {
    setMounted(true);
    setCalendarYear(localToday.getFullYear());
    setCalendarMonth(localToday.getMonth());

    const syncLanguage = () => {
      const targetLang = currentLanguage || localStorage.getItem("language") || localStorage.getItem("gpnr-language") || "en";
      setCurrentLang(targetLang);
    };

    syncLanguage();
    window.addEventListener("storage", syncLanguage);
    window.addEventListener("languageChange", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener("languageChange", syncLanguage);
    };
  }, [localToday, currentLanguage]);

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
      setCalendarMonth(calendarMonth - 1);
    }
  };

  // ✅ [수정 완료] 절대 경로(window.location.origin) 적용 및 예외 처리 강화
  const handleDonation = useCallback(async () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      try {
        const origin = window.location.origin;

        await (window as any).Pi.createPayment({
          amount: 0.001,
          memo: currentLang === "ko" ? "GPNR 서비스 후원" : "GPNR Service Donation",
          metadata: { type: "one-time-donation", app: "GPNR" }
        }, {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log("[Pi Payment] 서버 승인 요청 시작 paymentId:", paymentId);
            
            // 💡 window.location.origin을 추가하여 절대 경로로 호스트 전달 보장
            const res = await fetch(`${origin}/api/payments/approve`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ paymentId }) 
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              console.error("[Pi Payment] 서버 승인 실패:", errData);
              throw new Error("Payment approval failed on server.");
            }
            console.log("[Pi Payment] 서버 승인 성공!");
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log("[Pi Payment] 서버 완료 처리 시작 txid:", txid);
            
            // 💡 window.location.origin을 추가하여 절대 경로로 호스트 전달 보장
            const res = await fetch(`${origin}/api/payments/complete`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ paymentId, txid }) 
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              console.error("[Pi Payment] 서버 완료 처리 실패:", errData);
              throw new Error("Payment completion failed on server.");
            }
            alert(currentLang === "ko" ? "0.001 Pi 후원이 완료되었습니다. 감사합니다!" : "0.001 Pi donation completed. Thank you!");
          },
          onCancel: (paymentId: string) => console.log("[Pi Payment] 후원 취소됨:", paymentId),
          onError: (error: Error) => console.error("[Pi Payment] 결제 에러:", error),
        });
      } catch (err) {
        console.error("Pi SDK payment execution failed:", err);
      }
    } else {
      alert(currentLang === "ko" ? "Pi Browser에서 접속하거나 SDK 로딩을 확인해주세요." : "Please access through Pi Browser or check SDK loading.");
    }
  }, [currentLang]);

  const FIXED_LAUNCHER_ITEMS: LauncherItem[] = [
    { id: "all", icon: "📱", label: "전체", enLabel: "Top News" },
    { id: "mainnet", icon: "⚡", label: "메인넷", enLabel: "Mainnet" },
    { id: "node", icon: "💻", label: "노드", enLabel: "Node" },
    { id: "mining", icon: "⛏️", label: "마이닝", enLabel: "Mining" },
    { id: "wallet", icon: "👛", label: "지갑", enLabel: "Wallet" },
    { id: "browser", icon: "🌐", label: "브라우저", enLabel: "Browser" },
    { id: "roadmap", icon: "🗺️", label: "로드맵", enLabel: "Roadmap" },
    { id: "whitepaper", icon: "📄", label: "백서", enLabel: "Whitepaper" },
    { id: "community", icon: "👥", label: "커뮤니티", enLabel: "Community" },
    { id: "commerce", icon: "🛒", label: "커머스", enLabel: "Commerce" },
    { id: "kyc", icon: "🆔", label: "KYC", enLabel: "KYC" },
    { id: "developer", icon: "🛠️", label: "개발자", enLabel: "Developers" },
    { id: "ecosystem", icon: "🌱", label: "생태계", enLabel: "Real Estate" },
    { id: "outlook", icon: "🔮", label: "전망", enLabel: "Price Outlook" },
    { id: "price", icon: "📈", label: "가격", enLabel: "Price" },
    { id: "security", icon: "🛡️", label: "보안", enLabel: "Security" },
    { id: "events", icon: "🎁", label: "이벤트", enLabel: "Events" },
    { id: "legal", icon: "⚖️", label: "법률", enLabel: "Regulations" },
    { id: "calendar", icon: "📅", label: "달력", enLabel: "Calendar" }
  ];

  if (!mounted) return null;

  // 유저 지갑/KYC ID 축약 표시 (예: GAC7XH...ZXXPBB)
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
                className="font-black text-lg tracking-tighter" 
                style={{ animation: 'gpnr-lighting 14s steps(1) infinite' }}
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
            
            {/* 우측 아이콘 및 지갑 인증 배너 */}
            <div className="flex items-center gap-2">
              {/* 후원 버튼 */}
              <button 
                onClick={handleDonation} 
                className="flex items-center gap-0.5 bg-[#f7a145]/20 text-[#f7a145] px-2 py-0.5 rounded-full border border-[#f7a145]/30 hover:bg-[#f7a145]/30 transition-colors text-[10px] font-bold"
              >
                <span>π</span>
                <span>0.001</span>
              </button>

              {/* 9개 점 / 카테고리 메뉴 토글 버튼 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`px-2 py-1 rounded-lg text-lg font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                ☰
              </button>

              {/* 기존 PiLogin을 대체하여 안전하게 지갑 상태 표출 */}
              {isAuthenticated && user ? (
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

      {/* 2. 9개 점 드롭다운 메뉴 */}
      {isLauncherOpen && (
        <div className="fixed top-[49px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {FIXED_LAUNCHER_ITEMS.map((item) => {
              const isSelected = currentCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "calendar") { setIsCalendarOpen(true); } 
                    else { if (onCategoryChange) onCategoryChange(item.id); }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full whitespace-nowrap">
                    {currentLang === "ko" ? item.label : item.enLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 인증 상태일 때 ID 변경 / 해제 버튼 추가 */}
          {isAuthenticated && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  logout();
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

      {/* 3. 달력 모달 팝업 */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📅</span> <span>{currentLang === "ko" ? "달력 (Calendar)" : "Calendar"}</span>
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
                  const isToday = localToday.getDate() === day && localToday.getMonth() === calendarMonth && localToday.getFullYear() === calendarYear;
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
