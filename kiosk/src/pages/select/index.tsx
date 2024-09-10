import { useRouter } from 'next/router';

export default function SelectMethod() {
  const router = useRouter();

  // 바코드 인식을 선택했을 때
  const handleBarcodeClick = () => {
    router.push('/barcode');
  };

  // RFID 인식을 선택했을 때
  const handleRFIDClick = () => {
    router.push('/rfid');
  };

  return (
    <div>
      <h1>Select Recognition Method</h1>
      <button onClick={handleBarcodeClick}>Barcode Recognition</button>
      <button onClick={handleRFIDClick}>RFID Recognition</button>
    </div>
  );
}
