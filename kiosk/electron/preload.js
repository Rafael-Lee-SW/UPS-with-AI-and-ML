const { ipcRenderer, contextBridge } = require("electron");

// Electron API를 window.electronAPI에 노출
contextBridge.exposeInMainWorld("electronAPI", {
  onRFIDDetected: (callback) => {
    const handler = (event, data) => {
      console.log("NFC Data received in preload:", data);
      callback(data); // 데이터를 프론트엔드로 전달
    };

    // NFC 데이터 이벤트 리스너 등록
    ipcRenderer.on("nfc-data", handler);

    // 리스너 제거 함수 반환
    return () => {
      ipcRenderer.removeListener("nfc-data", handler);
    };
  },
});
