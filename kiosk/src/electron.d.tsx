export {};

declare global {
  interface Window {
    electronAPI: {
      sendToBackend: (channel: string, data: any) => void;
      onReceive: (channel: string, callback: (args: any) => void) => void;
      saveProducts: (products: { name: string; price: number }[]) => void; // 상품 저장
      loadProducts: () => Promise<{ name: string; price: number }[]>;      // 상품 불러오기
    };
  }
}
