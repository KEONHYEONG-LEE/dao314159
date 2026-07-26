import React, { useState, useEffect } from 'react';

const PiLogin = () => {
  const [piId, setPiId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) {
      setPiId(savedId);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    const savedId = localStorage.getItem('pi_user_id');
    const inputId = prompt(
      savedId ? `기존 ID: ${savedId.substring(0, 10)}...` : "Pi ID를 입력해주세요.", 
      savedId || ""
    );

    if (inputId) {
      setPiId(inputId);
      localStorage.setItem('pi_user_id', inputId);
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* 후원 버튼: 왼쪽 배치 및 금액 표시 */}
      <button 
        onClick={() => alert("0.001 Pi 후원을 진행합니다.")}
        className="bg-[#FF9800] text-white px-2 py-1.5 rounded-lg text-[10px] font-bold shadow-sm active:scale-95 flex items-center gap-1"
      >
        <span>Support</span>
        <span className="bg-white/20 px-1 rounded text-[9px]">0.001π</span>
      </button>

      {/* 로그인 버튼: 오른쪽 배치 및 상태별 배경색 */}
      <button 
        onClick={handleLoginClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 ${
          isLoggedIn ? 'bg-[#1E2B5E] border border-indigo-400/30' : 'bg-[#4A69FF]'
        } text-white`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <span>Login</span>
        {isLoggedIn && (
          <div className="flex items-center gap-1 ml-1 border-l border-white/20 pl-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-[9px] opacity-80 truncate max-w-[40px]">{piId}</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default PiLogin;
