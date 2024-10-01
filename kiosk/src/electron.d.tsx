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
      onRFIDDetected: (callback: (rfid: string) => void) => void;
    };
    // TossPayments 선언
    TossPayments: (clientKey: string) => TossPaymentsSDK; // 중복되지 않게 한 번만 정의
  }

  // TossPaymentsSDK 타입 정의
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
