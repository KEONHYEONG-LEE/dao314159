// @ts-nocheck
"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { User, ChevronUp, Languages, Loader2 } from "lucide-react"; 

// 공통 인증 훅 연결 (상대경로 유지를 통해 빌드 에러 방지)
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";

// cn 유틸리티 함수 내장 (미존재 시 대응)
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" ");

const PiLogin = () => {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. 구글 번역/투명 래퍼 관련 스타일 주입
    if (typeof document !== 'undefined') {
      const styleId = "gpnr-google-translate-pi-login-hide";
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .goog-te-banner-frame, .goog-te-gadget, #goog-gt-tt, .goog-te-balloon-frame, .skiptranslate {
            display: none !important;
            visibility: hidden !important;
          }
          body { top: 0px !important; position: static !important; }
        `;
        document.head.appendChild(style);
      }
    }

    // 2. 파이 브라우저 광고 네트워크 지원 여부 체크
    if (typeof window !== 'undefined' && (window as any).Pi) {
      try {
        (window as any).Pi.nativeFeaturesList().then((features: string[]) => {
          const isAdSupported = features.includes("ad_network");
          console.log("Pi Ad Network Supported:", isAdSupported);
        }).catch((err: any) => {
          console.log("Native features check error:", err);
        });
      } catch (err) {
        console.log("Pi SDK Native Features Init Error:", err);
      }
    }
  }, []);

  // 후원하기 버튼 클릭 이벤트 (0.01 Pi)
  const handleSupport = async () => {
    if (typeof window === 'undefined' || !(window as any).Pi) {
      alert("Pi 브라우저에서 접속하거나 SDK 로딩을 기다려주세요.");
      return;
    }

    if (!isAuthenticated) {
      alert("KYC/지갑 ID 인증 후 이용해 주세요.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      await (window as any).Pi.createPayment({
        amount: 0.01, // [수정] 0.01 Pi로 설정
        memo: "GPNR 프로젝트 후원",
        metadata: { orderId: `donation-${Date.now()}` },
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("결제 승인 대기:", paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          alert("성공적으로 0.01 Pi를 후원했습니다! 감사합니다.");
          setLoading(false);
        },
        onCancel: () => setLoading(false),
        onError: (error: Error) => {
          alert(`에러: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (err) {
      alert("결제창을 열 수 없습니다.");
      setLoading(false);
    }
  };

  // 유저 아이콘 클릭 이벤트 (로그아웃 및 재입력 처리)
  const handleLoginClick = () => {
    if (isAuthenticated) {
      if (confirm("연동된 KYC/지갑 ID를 해제하고 다시 입력하시겠습니까?")) {
        logout();
      }
    } else {
      window.location.reload();
    }
  };

  // 언어 변경 처리
  const handleLanguageChange = (code: string) => {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event('change'));
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem("language", code);
      localStorage.setItem("gpnr-language", code);
      window.dispatchEvent(new Event("languageChange"));
    }
    
    setIsBottomLangOpen(false);
  };

  if (!mounted) return null;

  const displayUsername = user?.username || "";

  return (
    <Fragment>
      {/* 우측 상단 후원 및 유저 프로필 영역 */}
      <div className="flex items-center gap-2 notranslate">
        <button 
          onClick={handleSupport}
          disabled={loading}
          type="button"
          className={cn(
            "px-2.5 h-8 flex items-center rounded-full border transition-all active:scale-95 cursor-pointer",
            isAuthenticated 
              ? "bg-amber-100/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20" 
              : "bg-slate-800 text-slate-500 border-slate-700 opacity-60"
          )}
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
          ) : (
            <span className="text-[10px] font-bold uppercase">π 0.01</span>
          )}
        </button>

        <button 
          onClick={handleLoginClick}
          type="button"
          title={isAuthenticated && displayUsername ? `접속된 ID: ${displayUsername}` : "KYC ID 인증 필요"}
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-full border transition-all active:scale-95 cursor-pointer",
            isAuthenticated ? "bg-purple-600 border-purple-400 shadow-lg shadow-purple-900/40" : "bg-[#1e293b] border-slate-700"
          )}
        >
          <User className={cn("h-4 w-4", isAuthenticated ? "text-white" : "text-slate-400")} />
        </button>
      </div>

      {/* 우측 하단 플로팅 언어 선택 토글 버튼 및 팝업 UI */}
      <div className="fixed bottom-24 right-5 z-[9999] flex flex-col items-end gap-2 notranslate">
        {isBottomLangOpen && (
          <div className="mb-1 w-32 bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl overflow-hidden">
            <button 
              type="button"
              onClick={() => handleLanguageChange('en')} 
              className="w-full px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 flex justify-between items-center transition-colors"
            >
              <span>English</span><span className="opacity-40 text-[10px]">en</span>
            </button>
            <button 
              type="button"
              onClick={() => handleLanguageChange('ko')} 
              className="w-full px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 flex justify-between items-center transition-colors"
            >
              <span>한국어</span><span className="opacity-40 text-[10px]">ko</span>
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsBottomLangOpen(!isBottomLangOpen)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 shadow-blue-950/50 shadow-xl transition-all active:scale-95"
        >
          <Languages className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold tracking-wider uppercase">언어 / Lang</span>
          <ChevronUp className={cn("h-3.5 w-3.5 transition-transform duration-200", isBottomLangOpen && "rotate-180")} />
        </button>
      </div>
    </Fragment>
  );
};

export default PiLogin;
