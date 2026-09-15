import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    Pi?: any;
    __PI_INITIALIZED__?: boolean;
  }
}

export interface PiUser {
  username: string;
  uid?: string;
  effectiveStake?: number;
  isVip?: boolean;
}

export function usePiNetworkAuthentication() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const handleIncompletePayment = useCallback(async (payment: any) => {
    console.log("미완료 결제 건 발견 및 처리 시도:", payment);
    try {
      // 미완료 결제 처리 로직
    } catch (err) {
      console.error("미완료 결제 처리 중 오류 발생:", err);
    }
  }, []);

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
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    let isSubscribed = true;

    const savedId = localStorage.getItem('gpnr_kyc_id');
    const savedVip = localStorage.getItem('gpnr_is_vip') === 'true';
    const savedStake = Number(localStorage.getItem('gpnr_effective_stake') || 0);

    if (savedId && savedId !== 'undefined' && savedId !== 'null' && savedId.trim() !== '') {
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

    const initializePiAuth = async () => {
      try {
        if (!window.Pi) {
          console.warn("Pi SDK 미발견 - 수동 ID 입력 팝업 모드로 대기합니다.");
          if (isSubscribed) setIsLoading(false);
          return;
        }

        if (!window.__PI_INITIALIZED__) {
          window.Pi.init({ version: "2.0", sandbox: false });
          window.__PI_INITIALIZED__ = true;
        }

        const scopes = ['username', 'payments', 'wallet_address'];
        const authResult = await window.Pi.authenticate(scopes, handleIncompletePayment);

        if (authResult && authResult.user && isSubscribed) {
          const rawId = authResult.user.uid || authResult.user.username || '';

          if (rawId && rawId !== 'undefined' && rawId !== 'null' && rawId.trim() !== '') {
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
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    initializePiAuth();

    return () => {
      isSubscribed = false;
    };
  }, [isMounted, handleIncompletePayment, fetchStakingInfo]);

  const loginWithKycId = (kycId: string) => {
    const cleanId = kycId.trim();
    if (!cleanId || cleanId === 'undefined' || cleanId === 'null') {
      return false;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('gpnr_kyc_id', cleanId);
    }
    setUser({ username: cleanId, uid: cleanId, effectiveStake: 0, isVip: false });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gpnr_kyc_id');
      localStorage.removeItem('gpnr_is_vip');
      localStorage.removeItem('gpnr_effective_stake');
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return { 
    user, 
    isAuthenticated: isMounted ? isAuthenticated : false, 
    isLoading: isMounted ? isLoading : true, 
    loginWithKycId, 
    logout 
  };
}
