import { useState, useEffect, useCallback } from 'react';

// window.Pi 객체 타입 정의 (TypeScript 지원)
declare global {
  interface Window {
    Pi?: any;
  }
}

// 파이 네트워크 유저 객체 타입 정의
export interface PiUser {
  username: string; // 56자리 지갑 주소 또는 KYC ID / Username
  uid?: string;
}

export function usePiNetworkAuthentication() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 미완료 결제 건 처리 함수 (사진 1의 최신 결제 플로우 대비)
  const handleIncompletePayment = useCallback(async (payment: any) => {
    console.log("미완료 결제 건 발견 및 처리 시도:", payment);
    try {
      // 필요 시 백엔드 API 호출하여 미완료 결제 완료 처리
      // await fetch('/api/pi/incomplete-payment', { method: 'POST', body: JSON.stringify({ payment }) });
    } catch (err) {
      console.error("미완료 결제 처리 중 오류 발생:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. 저장된 KYC ID/지갑주소 확인 및 예외 처리 ("undefined", "null" 방어)
    const savedId = localStorage.getItem('gpnr_kyc_id');

    if (
      savedId && 
      savedId !== 'undefined' && 
      savedId !== 'null' && 
      savedId.trim() !== ''
    ) {
      setUser({ username: savedId, uid: savedId });
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      localStorage.removeItem('gpnr_kyc_id');
      setUser(null);
      setIsAuthenticated(false);
    }

    // 2. Pi SDK 자동 인증 시도
    const initializePiAuth = async () => {
      try {
        if (!window.Pi) {
          console.warn("Pi SDK 미발견 - 수동 ID 입력 팝업 모드로 대기합니다.");
          setIsLoading(false);
          return;
        }

        // Pi SDK 초기화
        window.Pi.init({ version: "2.0", sandbox: false });

        const scopes = ['username', 'payments', 'wallet_address'];
        const authResult = await window.Pi.authenticate(
          scopes, 
          handleIncompletePayment // 미완료 결제 콜백 연결
        );

        if (authResult && authResult.user) {
          const rawId = authResult.user.uid || authResult.user.username || '';
          
          if (rawId && rawId !== 'undefined' && rawId !== 'null' && rawId.trim() !== '') {
            setUser({ username: rawId, uid: authResult.user.uid });
            setIsAuthenticated(true);
            localStorage.setItem('gpnr_kyc_id', rawId);
          } else {
            console.warn("Pi SDK 인증 결과의 유저 ID가 유효하지 않습니다. 수동 입력을 요청합니다.");
          }
        }
      } catch (error) {
        console.error("Pi SDK 자동 인증 스킵/오류 - 수동 입력 모드 준비:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePiAuth();
  }, [handleIncompletePayment]);

  // 팝업에서 유저가 56자리 KYC ID 수동 입력 시 호출하는 로그인 함수
  const loginWithKycId = (kycId: string) => {
    const cleanId = kycId.trim();
    
    if (!cleanId || cleanId === 'undefined' || cleanId === 'null') {
      return false;
    }

    localStorage.setItem('gpnr_kyc_id', cleanId);
    setUser({ username: cleanId, uid: cleanId });
    setIsAuthenticated(true);
    return true;
  };

  // 로그아웃 / ID 재설정
  const logout = () => {
    localStorage.removeItem('gpnr_kyc_id');
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, isLoading, loginWithKycId, logout };
}
