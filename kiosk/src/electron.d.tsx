export {};

declare global {
  interface Window {
    electronAPI: {
      sendToBackend: (channel: string, data: any) => void;
      onReceive: (channel: string, callback: (args: any) => void) => void;
      saveProducts: (products: { name: string; price: number }[]) => void;
      loadProducts: () => Promise<{ name: string; price: number }[]>;
      login: (key: string) => Promise<boolean>;
      navigateToPage: () => Promise<void>;
      onRFIDDetected: (callback: (rfid: string) => void) => () => void; // 리스너 제거 함수 반환
    };
    TossPayments: (clientKey: string) => TossPaymentsSDK;
  }

  interface TossPaymentsSDK {
    requestPayment: (
      method: string,
      options: {
        amount: number;
        orderId: string;
        orderName: string;
        successUrl: string;
        failUrl: string;
        customerName: string;
        customerEmail: string;
      }
    ) => Promise<void>;
  }
}
