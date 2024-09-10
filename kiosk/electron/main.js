const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('./api/kiosk');  // API 모듈 가져오기

let mainWindow;
const productFilePath = path.join(app.getPath('userData'), 'products.json');  // 상품 정보 저장 경로

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // preload.js 로드
    },
  });

  mainWindow.loadFile('index.html');  // 토큰 입력 폼 로드
}

app.whenReady().then(createWindow);

// 파일 시스템에 상품 정보 저장
ipcMain.on('save-products', (event, products) => {
  fs.writeFileSync(productFilePath, JSON.stringify(products));  // 상품 정보 저장
});

// 파일 시스템에서 상품 정보 불러오기
ipcMain.handle('load-products', () => {
  if (fs.existsSync(productFilePath)) {
    const data = fs.readFileSync(productFilePath);
    return JSON.parse(data);
  } else {
    return [];
  }
});

// 토큰 검증 및 응답 처리
ipcMain.handle('verify-token', async (event, token) => {
  const result = await verifyToken(token);  // API 모듈 사용
  if (result.valid) {
    event.sender.send('save-products', result.products);  // 성공 시 상품 정보 저장
  }
  return result.valid;
});

// 애플리케이션 실행
ipcMain.on('start-app', () => {
  mainWindow.loadURL('http://localhost:3000');  // Next.js 애플리케이션 로드
});
