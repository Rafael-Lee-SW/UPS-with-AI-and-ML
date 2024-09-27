const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onRFIDDetected: (callback) => {
    ipcRenderer.on("rfid-data", (event, data) => {
      callback(data); // RFID 데이터를 프론트엔드로 전달
    });
  },
  navigateToPage: () => ipcRenderer.invoke("navigateToPage"),
});
