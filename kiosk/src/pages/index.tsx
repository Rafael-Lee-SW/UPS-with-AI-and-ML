import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchProducts } from "@/api/index"; // API 함수 호출

// 상품 정보 타입 정의
interface Product {
  productId: number;
  productName: string;
  barcode: string;
  sku: string;
  quantity: number;
  locationName: string;
  floorLevel: number;
  originalPrice: number | null;
  sellingPrice: number | null;
}

export default function Home() {
  const [storeId, setStoreId] = useState(""); // storeId 상태
  const [error, setError] = useState(""); // 에러 상태
  const [rfidData, setRfidData] = useState(""); // RFID 데이터를 위한 상태
  const [products, setProducts] = useState<Product[]>([]); // 상품 정보 상태
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
      console.log("불러온 제품 리스트:", products); // 불러온 제품 리스트 콘솔 출력
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
      window.electronAPI.onRFIDDetected((data: string) => {
        setRfidData(data);
        setStoreId(data);
      });
    }
  }, []);

  // products 상태가 업데이트될 때마다 콘솔에 출력
  useEffect(() => {
    if (products.length > 0) {
      console.log("제품 배열:", products);
    }
  }, [products]);

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
