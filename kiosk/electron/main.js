const { app, BrowserWindow } = require('electron');
const path = require('path');

// Electron 창을 생성하고, Next.js 서버에 연결하는 함수
function createWindow() {
  const win = new BrowserWindow({
    width: 800,  // 창의 가로 크기
    height: 600, // 창의 세로 크기
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // preload.js 파일을 통해 Electron과 Next.js가 통신
    },
  });

  win.loadURL('http://localhost:3000'); // Next.js 서버가 실행 중인 URL로 창을 띄움
}

// Electron 애플리케이션이 준비되면 창을 생성
app.whenReady().then(() => {
  createWindow();

  // 모든 창이 닫혔을 때 다시 창을 활성화하는 로직 (macOS에서는 필요)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 모든 창이 닫히면 애플리케이션을 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit(); // macOS 외의 시스템에서는 모든 창을 닫으면 앱 종료
});
