// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    Pi?: any;
    __piSdkInitialized?: boolean;
  }
}

export interface PiUser {
  username: string;
  uid?: string;
  walletAddress?: string;
  effectiveStake?: number;
  isVip?: boolean;
}

export function usePiNetworkAuthentication() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 미완료 결제 건 처리
  const handleIncompletePayment = useCallback(async (payment: any) => {
    try {
      console.log("미완료 결제 건 발견:", payment);
    } catch (err) {
      console.error("미완료 결제 처리 중 오류:", err);
    }
  }, []);

  // 스테이킹 정보 조회
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

    // 1. 저장된 스토리지 안전 조회
    try {
      const savedId = localStorage.getItem('gpnr_kyc_id');
      const savedWallet = localStorage.getItem('gpnr_wallet_address');
      const savedVip = localStorage.getItem('gpnr_is_vip') === 'true';
      const savedStake = Number(localStorage.getItem('gpnr_effective_stake') || 0);

      if (savedId && savedId !== 'undefined' && savedId !== 'null' && savedId.trim() !== '') {
        setUser({ 
          username: savedWallet || savedId, 
          uid: savedId,
          walletAddress: savedWallet || undefined,
          effectiveStake: savedStake,
          isVip: savedVip,
        });
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("localStorage 접근 오류:", e);
    }

    // 2. Pi SDK 안전 초기화 및 인증
    const initializePiAuth = async () => {
      try {
        if (!window.Pi) {
          setIsLoading(false);
          return;
        }

        // 중복 init 방지
        if (!window.__piSdkInitialized) {
          window.Pi.init({ version: "2.0", sandbox: false });
          window.__piSdkInitialized = true;
        }

        const scopes = ['username', 'payments', 'wallet_address'];
        const authResult = await window.Pi.authenticate(scopes, handleIncompletePayment);

        if (authResult && authResult.user) {
          // 파이 사용자 계정명(username)과 지갑 주소(wallet_address) 추출
          const piUsername = authResult.user.username || '';
          const piWalletAddress = authResult.user.wallet_address || authResult.user.walletAddress || '';
          const piUid = authResult.user.uid || '';

          // 식별자로 우선 사용할 값 (지갑 주소가 있으면 지갑 주소, 없으면 파이 아이디)
          const primaryDisplayId = piWalletAddress || piUsername || piUid;
          
          if (primaryDisplayId && primaryDisplayId !== 'undefined' && primaryDisplayId !== 'null' && primaryDisplayId.trim() !== '') {
            let stakingData = { effectiveStake: 0, isVip: false };
            if (authResult.accessToken) {
              stakingData = await fetchStakingInfo(authResult.accessToken);
            }

            const userData: PiUser = { 
              username: primaryDisplayId, 
              uid: piUid || piUsername,
              walletAddress: piWalletAddress || undefined,
              effectiveStake: stakingData.effectiveStake,
              isVip: stakingData.isVip,
            };

            setUser(userData);
            setIsAuthenticated(true);
            
            localStorage.setItem('gpnr_kyc_id', primaryDisplayId);
            if (piWalletAddress) {
              localStorage.setItem('gpnr_wallet_address', piWalletAddress);
            }
            localStorage.setItem('gpnr_is_vip', String(stakingData.isVip));
            localStorage.setItem('gpnr_effective_stake', String(stakingData.effectiveStake));
          }
        }
      } catch (error) {
        console.warn("Pi SDK 인증 중단/스킵:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePiAuth();
  }, [handleIncompletePayment, fetchStakingInfo]);

  const loginWithKycId = (kycId: string) => {
    const cleanId = kycId ? kycId.trim() : '';
    if (!cleanId || cleanId === 'undefined' || cleanId === 'null') {
      return false;
    }

    try {
      localStorage.setItem('gpnr_kyc_id', cleanId);
    } catch (e) {}

    setUser({ username: cleanId, uid: cleanId, effectiveStake: 0, isVip: false });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    try {
      localStorage.removeItem('gpnr_kyc_id');
      localStorage.removeItem('gpnr_wallet_address');
      localStorage.removeItem('gpnr_is_vip');
      localStorage.removeItem('gpnr_effective_stake');
    } catch (e) {}
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, isLoading, loginWithKycId, logout };
}
