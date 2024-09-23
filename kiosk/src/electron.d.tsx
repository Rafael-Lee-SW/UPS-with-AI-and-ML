// electron.d.tsx (기존 파일에 추가)
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
      onRFIDDetected: (callback: (rfid: string) => void) => void;  // onRFIDDetected 추가
    };
  }
}
