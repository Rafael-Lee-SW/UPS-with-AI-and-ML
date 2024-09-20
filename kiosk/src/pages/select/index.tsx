import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './select.module.css'; // CSS 모듈 가져오기

export default function SelectMethod() {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false); // 버튼 비활성화 상태 관리

  // 바코드 인식을 선택했을 때
  const handleBarcodeClick = () => {
    setIsDisabled(true);  // 버튼 비활성화
    router.push('/barcode');  // 바코드 페이지로 이동
  };

  // RFID 인식을 선택했을 때
  const handleRFIDClick = () => {
    setIsDisabled(true);  // 버튼 비활성화
    router.push('/rfid');  // RFID 페이지로 이동
  };

  return (
    <div className={styles.container}>
      {/* 상단 7/10 영역 */}
      <div className={styles.topSection}>
        {/* 여기에 이미지를 덮는 텍스트나 다른 UI를 추가할 수 있음 */}
      </div>

      {/* 하단 3/10 영역 */}
      <div className={styles.bottomSection}>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleBarcodeClick}
            disabled={isDisabled}
            className={styles.circleButton}
          >
            <img src="/barcord.png" alt="바코드 인식" />
            바코드로 상품 결제
          </button>
          <button
            onClick={handleRFIDClick}
            disabled={isDisabled}
            className={styles.circleButton}
          >
            <img src="/rfid.png" alt="RFID 인식" />
            상품 자동 결제
          </button>
        </div>

        <div className={styles.languageSelector}>
          <img src="/korea.png" alt="Korean" className={styles.languageIcon} />
          <img src="/usa.png" alt="English" className={styles.languageIcon} />
          <img src="/china.png" alt="Chinese" className={styles.languageIcon} />
          <img src="/japan.png" alt="Japanese" className={styles.languageIcon} />
        </div>
      </div>
    </div>
  );
}
