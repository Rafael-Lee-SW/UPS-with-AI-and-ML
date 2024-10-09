const { app, BrowserWindow } = require("electron");
const path = require("path");
const pcsclite = require("pcsclite");

app.commandLine.appendSwitch("high-dpi-support", "true");
app.commandLine.appendSwitch("force-device-scale-factor", "1");
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      zoomFactor: 0.75,
    },
  });
  const path = require('path');
  const startFilePath = path.join(__dirname, 'out', 'index.html'); // 'build/index.html' 경로
  mainWindow.loadFile(startFilePath);
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

            // 12번 블록 읽기
            readSpecificBlock(reader, protocol, 12);
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

function readSpecificBlock(reader, protocol, blockNumber) {
  const command = Buffer.from([0xff, 0xb0, 0x00, blockNumber, 0x10]); // 블록 읽기 명령어

  reader.transmit(command, 40, protocol, (err, data) => {
    if (err) {
      console.error(`Error reading block ${blockNumber}:`, err);
      return;
    }

    let fullData = data.toString("hex"); // hex 데이터를 문자열로 변환
    console.log(`Block ${blockNumber} data:`, fullData);

    // fe00을 찾아서 제거

    // ASCII로 변환
    let barcode = Buffer.from(fullData, "hex").toString("ascii").trim(); // 공백 제거 후 저장

    console.log(`Barcode (fe00 removed): ${barcode}`);


    // 숫자만 남기는 정규식 적용
    const numericBarcode = barcode.replace(/\D/g, ""); // 숫자가 아닌 모든 문자를 제거
    console.log(`정규식으로 숫자만 추출한 바코드: "${numericBarcode}", 길이: ${numericBarcode.length}`);


    if (barcode) {
      mainWindow.webContents.send("nfc-data", numericBarcode); // 정제된 바코드를 프론트엔드로 전송
    } else {

    }
  });
}


app.whenReady().then(() => {
  createWindow();
  connectNFCReader(); // NFC 리더 연결 함수 호출
});
