"use client";

import { useState, useEffect } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";

interface HeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
}

export function Header({ 
  currentCategory = "all", 
  onCategoryChange
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 
  
  // 공통 인증 훅 사용 (스토리지 키 gpnr_kyc_id 연동 및 로그아웃/로그인 상태 공유)
  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR 단계 레이아웃 튐 방지
  if (!mounted) {
    return (
      <header className="w-full h-[60px] bg-[#0f172a]/90 border-b border-slate-800"></header>
    );
  }

  // 지갑주소/KYC ID 축약 표시 (예: GAC7XH...ZXXPBB)
  const displayId = user?.username
    ? user.username.length > 15
      ? `${user.username.substring(0, 6)}...${user.username.substring(user.username.length - 6)}`
      : user.username
    : "";

  return (
    <div className="notranslate" translate="no">
      {/* 본체 헤더 영역 */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/90 border-b border-slate-800 backdrop-blur-xl transition-colors">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            
            {/* 로고 영역 */}
            <div className="flex items-center gap-2">
              <span 
                className="font-black text-2xl tracking-tighter text-purple-500 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]"
              >
                GPNR
              </span>
              <span 
                className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2"
              >
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 상단 유저 상태 및 메뉴 */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-mono text-purple-300 font-medium">
                    {displayId}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-amber-400/90 bg-amber-950/30 border border-amber-800/40 px-2.5 py-1 rounded-lg">
                  🔑 ID 미인증
                </div>
              )}

              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                title="메뉴 열기"
                className={`p-2 rounded-xl text-lg font-bold transition-all ${
                  isLauncherOpen ? 'bg-slate-800 text-purple-400' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <span className="block w-5 h-5 text-center leading-none">⋮⋮⋮</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 런처 메뉴(앱 토글러) 드롭다운 */}
      {isLauncherOpen && (
        <div className="absolute right-4 top-[65px] z-50 w-72 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="text-xs text-slate-400 font-medium mb-1">연동된 KYC ID / 지갑 주소</div>
          <div className="text-xs font-bold font-mono text-slate-200 break-all select-all bg-slate-950 p-2.5 rounded-xl border border-slate-800/50 mb-3">
            {user?.username ? user.username : "등록된 ID가 없습니다."}
          </div>
          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setIsLauncherOpen(false);
              }}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl transition-colors"
            >
              KYC ID 해제 및 다시 입력하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
