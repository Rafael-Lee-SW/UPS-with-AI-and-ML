const { ipcRenderer, contextBridge } = require('electron');
const HID = require('node-hid');  // USB 장치 모듈

// HID 장치 설정
const devices = HID.devices();

// RFID 리더기를 찾는 로직 (적절한 장치를 선택하는 방법)
const rfidDeviceInfo = devices.find(device => device.product.includes('RFID') || device.vendorId === /*RFID 리더기의 vendorId*/);
let rfidDevice;

if (rfidDeviceInfo) {
  rfidDevice = new HID.HID(rfidDeviceInfo.path);

  contextBridge.exposeInMainWorld('electronAPI', {
    onRFIDDetected: (callback) => {
      rfidDevice.on('data', (data) => {
        const rfidNumber = data.toString('hex');  // RFID 값을 16진수 문자열로 변환
        callback(rfidNumber);  // RFID 값을 프론트엔드로 전달
      });
    },
    navigateToPage: () => ipcRenderer.invoke('navigateToPage')
  });
} else {
  console.error('RFID 리더기를 찾을 수 없습니다.');
  contextBridge.exposeInMainWorld('electronAPI', {
    onRFIDDetected: (callback) => {
      console.error('RFID 리더기가 연결되지 않았습니다.');
    },
    navigateToPage: () => ipcRenderer.invoke('navigateToPage')
  });
}
