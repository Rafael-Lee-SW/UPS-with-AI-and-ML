// preload.js
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  login: (key) => ipcRenderer.invoke('login', key),
  navigateToPage: () => ipcRenderer.invoke('navigateToPage')
});

// main.js (Electron)
ipcMain.handle('login', (event, key) => {
  // 여기에 키 인증 로직을 넣습니다
  if (key === 'your-secret-key') {
    // 키가 유효한 경우 true 반환
    return true;
  } else {
    // 키가 유효하지 않은 경우 false 반환
    return false;
  }
});

ipcMain.handle('navigateToPage', (event) => {
  // 키 인증이 완료되면 해당 페이지로 이동
  win.loadURL('http://localhost:3000');  // Next.js 앱으로 이동
});
