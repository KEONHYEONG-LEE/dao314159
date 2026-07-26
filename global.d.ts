export {};

declare global {
  interface Window {
    Pi?: {
      // SDK 초기화
      init: (options: { version: string; sandbox: boolean }) => void;
      
      // 사용자 인증 및 로그인
      authenticate: (
        scopes: string[], 
        onIncompletePaymentFound: (payment: any) => void
      ) => Promise<{
        auth: {
          accessToken: string;
          user: {
            uid: string;
            username: string;
          };
        };
      }>;

      // 결제 생성 (가장 중요)
      createPayment: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Object;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: any) => void;
        }
      ) => Promise<any>;
    };
  }
}
