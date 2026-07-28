"use client";

import { useState, useEffect } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";
import { translations } from "../lib/translations";

interface HeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void;
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
}

export function Header({ 
  currentCategory = "all", 
  onCategoryChange,
  currentLang = "en",
  onLanguageChange
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 
  
  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();
  const t = translations[currentLang] || translations['en'];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="w-full h-[60px] bg-[#0f172a]/90 border-b border-slate-800"></header>
    );
  }

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
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onCategoryChange?.('all')}>
              <span className="font-black text-2xl tracking-tighter text-purple-500 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]">
                GPNR
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2">
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 상단 유저 상태 및 메뉴 버튼 */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-mono text-purple-300 font-medium">
                    {displayId}
                  </span>
                </div>
              ) : (
                <div className="hidden sm:block text-xs text-amber-400/90 bg-amber-950/30 border border-amber-800/40 px-2.5 py-1 rounded-lg">
                  🔑 ID 미인증
                </div>
              )}

              {/* Quick Link 그리드 버튼 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                title={t.launcher}
                className={`p-2.5 rounded-xl text-lg font-bold transition-all ${
                  isLauncherOpen ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-300 bg-slate-800/60 hover:bg-slate-800'
                }`}
              >
                <span className="block w-5 h-5 text-center leading-none">⋮⋮⋮</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 런처 메뉴(퀵 링크 및 드롭다운) */}
      {isLauncherOpen && (
        <div className="absolute right-4 top-[65px] z-50 w-80 bg-[#1e293b] border border-slate-700 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">{t.launcher}</span>
            <span className="text-[10px] text-slate-400">v2.5 Core</span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium mb-1">{t.wallet_connected}</div>
          <div className="text-xs font-bold font-mono text-slate-200 break-all select-all bg-[#0f172a] p-2.5 rounded-xl border border-slate-800 mb-4">
            {user?.username ? user.username : "등록된 ID가 없습니다."}
          </div>

          {/* 주요 외부 링크 퀵 버튼들 */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <a 
              href="https://minepi.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 text-center transition-colors"
            >
              🌐 Pi MinePi.com
            </a>
            <a 
              href="https://minepi.com/blockexplorer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 text-center transition-colors"
            >
              📊 Block Explorer
            </a>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setIsLauncherOpen(false);
              }}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl transition-colors"
            >
              {t.reset_kyc}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
