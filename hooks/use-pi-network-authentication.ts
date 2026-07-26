import { useState, useEffect } from 'react';

export const usePiNetworkAuthentication = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Pi SDK 초기화 확인 및 자동 로그인 시도
    const auth = async () => {
      try {
        const scopes = ['username', 'payments'];
        const onIncompletePaymentFound = (payment: any) => { /* 미완료 결제 처리 */ };

        // Pi.authenticate 호출 (SDK가 로드된 상태여야 함)
        // @ts-ignore
        const authResponse = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
        setUser(authResponse.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Pi Auth Failed:', error);
        setIsAuthenticated(false);
      }
    };

    auth();
  }, []);

  return { user, isAuthenticated };
};

