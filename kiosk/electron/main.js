const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const pcsclite = require('pcsclite');  // pcsclite 라이브러리 추가

// mainWindow 타입을 명시적으로 BrowserWindow | null 로 지정
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Preload 스크립트 로드
      nodeIntegration: true,
      contextIsolation: false,  // contextIsolation 설정 해제
    },
  });

  mainWindow.loadURL('http://localhost:3000');  // Next.js 페이지 로드

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  setupNFCReader();  // NFC 리더기 설정 함수 호출
});

// NFC 리더기 설정
function setupNFCReader() {
  const pcsc = pcsclite();

  pcsc.on('reader', (reader) => {
    console.log('NFC 리더기 연결됨:', reader.name);

    reader.on('status', (status) => {
      const changes = reader.state ^ status.state;
      if (changes & reader.SCARD_STATE_PRESENT) {
        console.log('NFC 태그가 인식되었습니다.');
        reader.connect({ share_mode: reader.SCARD_SHARE_SHARED }, (err, protocol) => {
          if (err) {
            console.error('카드 연결 실패:', err);
            return;
          }

          // APDU 명령을 사용하여 NFC 태그의 UID 읽기
          const apduCommand = Buffer.from('FF CA 00 00 00', 'hex'); // UID 읽기 명령어
          reader.transmit(apduCommand, 40, protocol, (err, data) => {
            if (err) {
              console.error('APDU 전송 실패:', err);
              return;
            }

            const nfcData = data.toString('hex');
            console.log('NFC 태그 데이터:', nfcData);

            // Next.js의 renderer 프로세스로 NFC 데이터를 전송
            if (mainWindow) {
              mainWindow.webContents.send('nfc-data', nfcData);
            }
          });
        });
      }
    });

    reader.on('end', () => {
      console.log('NFC 리더기 연결 해제');
    });
  });
}

// Next.js 페이지 간 이동을 처리하는 IPC 핸들러 추가
ipcMain.handle('navigateToPage', (event) => {
  if (mainWindow) {
    mainWindow.loadURL('http://localhost:3000/select');  // Next.js의 다른 페이지로 이동
  }
});
