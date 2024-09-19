import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { verifyToken, fetchProducts } from '@/api/index';  // API 모듈 가져오기

let mainWindow: BrowserWindow;  // 메인 Electron 창
const productFilePath = path.join(app.getPath('userData'), 'products.json');  // 상품 정보 저장 경로

// (1) Electron의 메인 창을 생성하는 함수
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,  // 창의 너비
    height: 600,  // 창의 높이
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Preload 스크립트 로드 (Electron과 렌더러 간의 상호작용)
    },
  });

  // (2) 초기 화면으로 index.html 파일을 로드
  mainWindow.loadFile('index.html');
}

// (3) Electron이 준비되었을 때 창을 생성
app.whenReady().then(createWindow);

// (4) 상품 정보를 파일 시스템에 저장하는 함수
ipcMain.on('save-products', (event, products) => {
  fs.writeFileSync(productFilePath, JSON.stringify(products));  // 상품 정보를 JSON 형식으로 저장
});

// (5) 파일 시스템에서 상품 정보를 불러오는 함수
ipcMain.handle('load-products', () => {
  if (fs.existsSync(productFilePath)) {
    // 'utf-8' 인코딩을 사용하여 문자열로 읽음
    const data = fs.readFileSync(productFilePath, 'utf-8');
    return JSON.parse(data);  // JSON으로 파싱하여 반환
  } else {
    return [];  // 파일이 없으면 빈 배열 반환
  }
});
// (6) 토큰 검증 API를 호출하는 함수
ipcMain.handle('verify-token', async (event, token: string) => {
  const result = await verifyToken(token);  // API를 통해 토큰 검증
  if (result.valid) {
    event.sender.send('save-products', result.products);  // 검증 성공 시 상품 정보 저장
  }
  return result.valid;  // 토큰 검증 결과 반환
});

// (7) Next.js 애플리케이션을 실행하는 함수 (검증 후)
ipcMain.on('start-app', () => {
  mainWindow.loadURL('http://localhost:3000');  // Next.js 서버 로드
});

// (8) 모든 창이 닫혔을 때 애플리케이션 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();  // macOS가 아닌 경우 애플리케이션 종료
  }
});
