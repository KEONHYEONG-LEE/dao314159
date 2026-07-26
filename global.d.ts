export {};

declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string; sandbox: boolean }) => void;
      // 필요한 다른 메서드가 있다면 여기에 추가하세요
      authenticate?: (scopes: string[], onIncompletePaymentFound: (payment: any) => void) => Promise<any>;
    };
  }
}

