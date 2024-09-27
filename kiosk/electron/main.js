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
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startURL = "http://localhost:3000";

  mainWindow.loadURL(startURL);
  mainWindow.webContents.on("did-fail-load", () => {
    setTimeout(() => {
      mainWindow.loadURL(startURL);
    }, 1000); // 1초 후 재시도
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// NFC 리더기 연결 및 태그 데이터를 읽는 함수
function connectNFCReader() {
  pcsc = pcsclite();

  pcsc.on("reader", (reader) => {
    console.log(`Reader detected: ${reader.name}`);

    reader.on("status", (status) => {
      const changes = reader.state ^ status.state;

      if (
        changes & reader.SCARD_STATE_PRESENT &&
        status.state & reader.SCARD_STATE_PRESENT
      ) {
        console.log("Card inserted");

        reader.connect(
          { share_mode: reader.SCARD_SHARE_SHARED },
          (err, protocol) => {
            if (err) {
              console.error("Error connecting to card:", err);
              return;
            }

            console.log("Card connected, protocol:", protocol);

            const command = Buffer.from([0xff, 0xca, 0x00, 0x00, 0x00]); // 명령어 예제 (UID 요청)

            reader.transmit(command, 255, protocol, (err, data) => {
              if (err) {
                console.error("Error transmitting data:", err);
              } else {
                const rfidNumber = data.toString("hex");
                console.log("RFID 데이터:", rfidNumber);

                mainWindow.webContents.send("rfid-data", rfidNumber); // RFID 데이터를 프론트엔드로 전달
              }
            });
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

app.whenReady().then(() => {
  createWindow();
  connectNFCReader(); // 앱이 준비되면 NFC 리더기 연결
});
