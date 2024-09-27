import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchProducts } from "@/api/index"; // API 함수 호출

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

    const { valid, products } = await fetchProducts(finalStoreId);

    if (valid) {
      router.push({
        pathname: "/select",
        query: { products: JSON.stringify(products) },
      });
    } else {
      setError("Invalid storeId");
    }
  };

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onRFIDDetected((data) => {
        setRfidData(data);
        setStoreId(data);
      });
    }
  }, []);

  return (
    <div>
      <h1>Enter your storeId or use RFID</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          placeholder="Enter storeId or use RFID"
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {rfidData && <p>RFID 감지됨: {rfidData}</p>}
    </div>
  );
}
