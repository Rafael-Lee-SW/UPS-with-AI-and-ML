import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from './select.module.css'; // CSS 모듈 가져오기

export default function SelectMethod() {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false); // 버튼 비활성화 상태 관리
  const [products, setProducts] = useState<any[]>([]); // 상품 정보 상태 관리

  // 상품 정보를 받아옴 (이전 페이지에서 전달된 정보)
  useEffect(() => {
    if (router.query.products) {
      setProducts(JSON.parse(router.query.products as string));
    }
  }, [router.query]);

  // 바코드 인식을 선택했을 때, 상품 정보를 바코드 페이지로 전달
  const handleBarcodeClick = () => {
    setIsDisabled(true);  // 버튼 비활성화
    router.push({
      pathname: '/barcode',
      query: { products: JSON.stringify(products) }
    });  // 바코드 페이지로 이동하며 상품 정보를 전달
  };

  // RFID 인식을 선택했을 때, 상품 정보를 RFID 페이지로 전달
  const handleRFIDClick = () => {
    setIsDisabled(true);  // 버튼 비활성화
    router.push({
      pathname: '/rfid',
      query: { products: JSON.stringify(products) }
    });  // RFID 페이지로 이동하며 상품 정보를 전달
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
