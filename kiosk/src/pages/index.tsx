import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchProducts } from "@/api/index"; // API 함수 호출
import styles from "./pages.module.css"; // 스타일 파일 임포트

export default function Home() {
  const [storeId, setStoreId] = useState(""); // storeId 상태
  const [error, setError] = useState(""); // 에러 상태
  const [rfidData, setRfidData] = useState(""); // RFID 데이터를 위한 상태
  const router = useRouter(); // Next.js 라우터 사용

  // form 제출 시 호출될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalStoreId = storeId || rfidData;

    if (!finalStoreId) {
      setError("Invalid storeId or RFID data");
      return;
    }

    // API 호출 및 응답 처리
    const { valid, products, storeName, accessToken } = await fetchProducts(finalStoreId);

    if (valid) {
      console.log("불러온 제품 리스트:", products);
      // accessToken과 storeName을 쿼리에 추가로 전달
      router.push({
        pathname: "/select",
        query: {
          products: JSON.stringify(products),
          storeName: storeName,
          accessToken: accessToken,
        },
      });
    } else {
      setError("Invalid storeId");
    }
  };

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onRFIDDetected((data: string) => {
        setRfidData(data);
        setStoreId(data);
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.welcome}>환영합니다. 매장 KEY를 입력해주세요.</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.inputBox}
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          placeholder="매장 키를 입력해주세요."
        />
        <button type="submit" className={styles.submitButton}>
          확인
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {rfidData && <p>RFID 감지됨: {rfidData}</p>}
    </div>
  );
}
