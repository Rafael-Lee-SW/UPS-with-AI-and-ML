export {};

declare global {
  interface Window {
    electron: {
      sendToBackend: (channel: string, data: any) => void;
      onReceive: (channel: string, callback: (args: any) => void) => void;
      saveProducts: (products: any[]) => void; // 상품 저장
      loadProducts: () => Promise<any[]>;      // 상품 불러오기
    };
  }
}
