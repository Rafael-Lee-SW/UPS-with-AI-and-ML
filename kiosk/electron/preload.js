const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onRFIDDetected: (callback) => {
    ipcRenderer.on("nfc-data", (event, data) => {
      console.log("NFC Data received in preload:", data); // 인식된 바코드를 출력
      callback(data); // 데이터를 프론트엔드로 전달
    });
  },
});
