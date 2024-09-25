// main.js 파일 (CommonJS 형식)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// mainWindow 타입을 명시적으로 BrowserWindow | null 로 지정
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Preload 스크립트 로드
    },
  });

  mainWindow.loadURL('http://localhost:3000');  // Next.js 페이지 로드

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

ipcMain.handle('navigateToPage', (event) => {
  if (mainWindow) {
    mainWindow.loadURL('http://localhost:3000/select');  // Next.js의 다른 페이지로 이동
  }
});
