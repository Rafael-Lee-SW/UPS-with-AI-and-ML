const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendToBackend: (channel, data) => ipcRenderer.send(channel, data),
  onReceive: (channel, callback) => ipcRenderer.on(channel, (event, args) => callback(args)),

  // 상품 정보 저장 및 불러오기
  saveProducts: (products) => ipcRenderer.send('save-products', products),
  loadProducts: () => ipcRenderer.invoke('load-products'),

  // 토큰 검증
  verifyToken: async (token) => {
    return await ipcRenderer.invoke('verify-token', token);
  },

  // 애플리케이션 실행
  startApp: () => ipcRenderer.send('start-app'),
});
