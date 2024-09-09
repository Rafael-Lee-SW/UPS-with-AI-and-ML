const { contextBridge, ipcRenderer } = require('electron');

// Electron의 메인 프로세스와 Next.js의 렌더러 프로세스 간의 통신을 가능하게 해주는 브리지
contextBridge.exposeInMainWorld('electron', {
  sendToBackend: (channel, data) => ipcRenderer.send(channel, data),
  onReceive: (channel, callback) => ipcRenderer.on(channel, (event, args) => callback(args)),
});
