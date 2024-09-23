import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

// mainWindow 타입을 명시적으로 BrowserWindow | null 로 지정
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Preload 스크립트 로드
    },
  });

  mainWindow.loadURL('http://localhost:3000');  // Next.js 페이지 로드

  // 창이 닫힐 때 mainWindow를 null로 설정
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

// 필요에 따라 mainWindow를 사용할 때 타입 검사를 추가
ipcMain.handle('navigateToPage', (event) => {
  if (mainWindow) {
    mainWindow.loadURL('http://localhost:3000/select');  // Next.js의 다른 페이지로 이동
  }
});
