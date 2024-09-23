const { ipcRenderer, contextBridge } = require('electron');
const HID = require('node-hid');  // USB 장치 모듈

// HID 장치 설정
const devices = HID.devices();
let rfidDevice = new HID.HID(devices[0].path);  // 첫 번째 장치로 설정 (RFID 리더기)

contextBridge.exposeInMainWorld('electronAPI', {
  onRFIDDetected: (callback) => {
    rfidDevice.on('data', (data) => {
      const rfidNumber = data.toString('hex');  // RFID 값을 16진수 문자열로 변환
      callback(rfidNumber);  // RFID 값을 프론트엔드로 전달
    });
  },
  navigateToPage: () => ipcRenderer.invoke('navigateToPage')
});
