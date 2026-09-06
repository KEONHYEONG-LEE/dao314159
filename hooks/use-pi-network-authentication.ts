import { useState, useEffect, useCallback } from 'react';

// window.Pi 객체 타입 정의 (TypeScript 지원)
declare global {
  interface Window {
    Pi?: any;
  }
}

// 파이 네트워크 유저 객체 타입 정의 (스테이킹 정보 추가)
export interface PiUser {
  username: string; // 56자리 지갑 주소 또는 KYC ID / Username
  uid?: string;
  effectiveStake?: number;
  isVip?: boolean;
}

export function usePiNetworkAuthentication() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 미완료 결제 건 처리 함수
  const handleIncompletePayment = useCallback(async (payment: any) => {
    console.log("미완료 결제 건 발견 및 처리 시도:", payment);
    try {
      // 필요 시 백엔드 API 호출하여 미완료 결제 완료 처리
    } catch (err) {
      console.error("미완료 결제 처리 중 오류 발생:", err);
    }
  }, []);

  // 스테이킹 정보 조회 함수
  const fetchStakingInfo = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch(`/api/pi/staking?accessToken=${accessToken}`);
      if (res.ok) {
        const data = await res.json();
        return {
          effectiveStake: data.effectiveStake || 0,
          isVip: !!data.isVip,
        };
      }
    } catch (err) {
      console.error("스테이킹 데이터 연동 실패:", err);
    }
    return { effectiveStake: 0, isVip: false };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. 저장된 KYC ID/지갑주소 및 VIP 상태 확인
    const savedId = localStorage.getItem('gpnr_kyc_id');
    const savedVip = localStorage.getItem('gpnr_is_vip') === 'true';
    const savedStake = Number(localStorage.getItem('gpnr_effective_stake') || 0);

    if (
      savedId && 
      savedId !== 'undefined' && 
      savedId !== 'null' && 
      savedId.trim() !== ''
    ) {
      setUser({ 
        username: savedId, 
        uid: savedId,
        effectiveStake: savedStake,
        isVip: savedVip,
      });
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      localStorage.removeItem('gpnr_kyc_id');
      localStorage.removeItem('gpnr_is_vip');
      localStorage.removeItem('gpnr_effective_stake');
      setUser(null);
      setIsAuthenticated(false);
    }

    // 2. Pi SDK 자동 인증 및 Staking API 조회
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
          handleIncompletePayment
        );

        if (authResult && authResult.user) {
          const rawId = authResult.user.uid || authResult.user.username || '';
          
          if (rawId && rawId !== 'undefined' && rawId !== 'null' && rawId.trim() !== '') {
            // Staking Data API 연동 조회
            let stakingData = { effectiveStake: 0, isVip: false };
            if (authResult.accessToken) {
              stakingData = await fetchStakingInfo(authResult.accessToken);
            }

            const userData: PiUser = { 
              username: rawId, 
              uid: authResult.user.uid,
              effectiveStake: stakingData.effectiveStake,
              isVip: stakingData.isVip,
            };

            setUser(userData);
            setIsAuthenticated(true);
            
            // 로컬 스토리지 동기화
            localStorage.setItem('gpnr_kyc_id', rawId);
            localStorage.setItem('gpnr_is_vip', String(stakingData.isVip));
            localStorage.setItem('gpnr_effective_stake', String(stakingData.effectiveStake));
          } else {
            console.warn("Pi SDK 인증 결과의 유저 ID가 유효하지 않습니다.");
          }
        }
      } catch (error) {
        console.error("Pi SDK 자동 인증 스킵/오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePiAuth();
  }, [handleIncompletePayment, fetchStakingInfo]);

  // 팝업 수동 로그인
  const loginWithKycId = (kycId: string) => {
    const cleanId = kycId.trim();
    
    if (!cleanId || cleanId === 'undefined' || cleanId === 'null') {
      return false;
    }

    localStorage.setItem('gpnr_kyc_id', cleanId);
    setUser({ username: cleanId, uid: cleanId, effectiveStake: 0, isVip: false });
    setIsAuthenticated(true);
    return true;
  };

  // 로그아웃 / ID 재설정
  const logout = () => {
    localStorage.removeItem('gpnr_kyc_id');
    localStorage.removeItem('gpnr_is_vip');
    localStorage.removeItem('gpnr_effective_stake');
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, isLoading, loginWithKycId, logout };
}
