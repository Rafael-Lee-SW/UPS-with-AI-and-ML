import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./select.module.css"; // CSS 모듈 가져오기

export default function SelectMethod() {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false); // 버튼 비활성화 상태 관리
  const [products, setProducts] = useState<any[]>([]); // 상품 정보 상태 관리
  const [accessToken, setAccessToken] = useState(""); // 액세스 토큰 상태
  const [storeName, setStoreName] = useState(""); // 스토어 이름 상태
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보여줄 이미지 인덱스

  const images = ["/poster1.jpg", "/poster2.png", "/poster3.png"]; // 사용할 이미지 목록

  // 상품 정보, accessToken, storeName을 받아옴 (이전 페이지에서 전달된 정보)
  useEffect(() => {
    if (router.query.products) {
      setProducts(JSON.parse(router.query.products as string));
    }
    const storedStoreName = localStorage.getItem("storeName");
    if (storedStoreName) {
      setStoreName(storedStoreName);
    }
  }, [router.query]);

  // 5초마다 배경 이미지 인덱스 교체
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // 순차적으로 인덱스 변경
    }, 3000); // 5초마다 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 제거
  }, []);

  // 바코드 인식을 선택했을 때, 상품 정보를 바코드 페이지로 전달
  const handleBarcodeClick = () => {
    setIsDisabled(true); // 버튼 비활성화
    router.push({
      pathname: "/barcode",
      query: {
        products: JSON.stringify(products),
        accessToken: accessToken,
        storeName: storeName,
      }, // 바코드 페이지로 상품 정보, accessToken, storeName 전달
    });
  };

  // RFID 인식을 선택했을 때, 상품 정보를 RFID 페이지로 전달
  const handleRFIDClick = () => {
    setIsDisabled(true); // 버튼 비활성화
    router.push({
      pathname: "/rfid",
      query: {
        products: JSON.stringify(products),
        accessToken: accessToken,
        storeName: storeName,
      }, // RFID 페이지로 상품 정보, accessToken, storeName 전달
    });
  };

  return (
    <div className={styles.container}>
      {/* 슬라이딩 배경 이미지 */}
      <div
        className={styles.slidingBackground}
        style={{ transform: `translateX(-${currentIndex * 100}vw)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={styles.backgroundImage}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* 버튼 및 UI 요소 (배경 위에 표시) */}
      <div className={styles.content}>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleBarcodeClick}
            disabled={isDisabled}
            className={styles.circleButton}
          >
            <img src="/barcode.png" alt="바코드 인식" />
            바코드 결제
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
      </div>
    </div>
  );
}
