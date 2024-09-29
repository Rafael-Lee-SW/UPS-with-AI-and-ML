const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const pcsclite = require("pcsclite");

let mainWindow = null;
let pcsc = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startURL = "http://localhost:3000";
  mainWindow.loadURL(startURL);
}

function connectNFCReader() {
  const pcsc = pcsclite();

  pcsc.on("reader", (reader) => {
    console.log(`Reader detected: ${reader.name}`);

    reader.on("status", (status) => {
      const changes = reader.state ^ status.state;

      if (
        changes & reader.SCARD_STATE_PRESENT &&
        status.state & reader.SCARD_STATE_PRESENT
      ) {
        reader.connect(
          { share_mode: reader.SCARD_SHARE_SHARED },
          (err, protocol) => {
            if (err) {
              console.error("Error connecting to card:", err);
              return;
            }

            console.log("Card connected, protocol:", protocol);

            // NDEF 메시지 읽기
            readNdefMessage(reader, protocol);
          }
        );
      } else if (
        changes & reader.SCARD_STATE_EMPTY &&
        status.state & reader.SCARD_STATE_EMPTY
      ) {
        console.log("Card removed");
        reader.disconnect(reader.SCARD_LEAVE_CARD, (err) => {
          if (err) {
            console.error("Error disconnecting:", err);
          } else {
            console.log("Card disconnected");
          }
        });
      }
    });

    reader.on("end", () => {
      console.log(`Reader removed: ${reader.name}`);
      reader.close();
    });

    reader.on("error", (err) => {
      console.error("Reader error:", err);
    });
  });

  pcsc.on("error", (err) => {
    console.error("PCSC error:", err);
  });
}

function readNdefMessage(reader, protocol) {
  const command = Buffer.from([0xff, 0xb0, 0x00, 0x04, 0x10]); // NFC 태그 읽기

  reader.transmit(command, 40, protocol, (err, data) => {
    if (err) {
      console.error("Error reading tag:", err);
      return;
    }

    const fullData = data.slice(0, -2); // SW1, SW2 제외
    console.log("읽은 전체 데이터 (fullData):", fullData.toString("hex")); // 전체 데이터를 출력

    // 바코드 추출 부분
    const headerLength = 8; // 헤더 길이
    const barcodeData = fullData.slice(headerLength); // 헤더 제외
    let barcode = barcodeData.toString("ascii").match(/\d+/g)?.join("") || null;

    if (barcode && barcode.startsWith("4")) {
      barcode = barcode.slice(1); // 첫 번째 '4' 제거
    }

    if (barcode) {
      console.log("Barcode detected:", barcode);
      mainWindow.webContents.send("nfc-data", barcode); // 바코드 프론트엔드로 전송
    } else {
      console.log("바코드를 찾을 수 없습니다.");
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  connectNFCReader(); // NFC 리더 연결 함수 호출
});
