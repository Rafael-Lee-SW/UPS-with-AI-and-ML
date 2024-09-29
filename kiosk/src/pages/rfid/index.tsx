import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./rfid.module.css";

// 상품 정보 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  quantity: number;
}

export default function RFIDPage() {
  const router = useRouter();
  const [barcode, setBarcode] = useState(""); // 바코드 상태
  const [products, setProducts] = useState<Product[]>([]); // 상품 정보 상태
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]); // 인식된 상품 리스트
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [beforeScan, setBeforeScan] = useState(true); // 스캔 전후 상태
  const [error, setError] = useState(""); // 오류 메시지 상태

  // 쿼리에서 받은 product 데이터를 상태에 저장
  useEffect(() => {
    if (router.query.products) {
      const parsedProducts = JSON.parse(router.query.products as string);
      setProducts(parsedProducts);
      console.log("제품 목록:", parsedProducts); // 제품 목록을 콘솔에 출력
    }
  }, [router.query.products]);

  // RFID 데이터가 인식되면 호출될 함수
  const fetchAndSetProducts = (barcode: string) => {
    setLoading(true);
    console.log("인식된 바코드:", barcode); // 바코드가 인식되면 콘솔에 출력

    const matchedProduct = products.find(
      (product) => product.barcode === barcode
    );

    if (matchedProduct) {
      setScannedProducts((prevScannedProducts) => {
        const existingProduct = prevScannedProducts.find(
          (product) => product.barcode === barcode
        );

        if (existingProduct) {
          existingProduct.quantity += 1; // 동일 상품 수량 증가
        } else {
          matchedProduct.quantity = 1; // 처음 인식된 상품은 수량 1로 설정
          prevScannedProducts.push(matchedProduct);
        }

        return [...prevScannedProducts]; // 새로운 리스트 반환
      });
    } else {
      console.log("일치하는 상품이 없습니다."); // 일치하는 상품이 없을 경우 콘솔에 메시지 출력
    }

    setLoading(false);
  };

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onRFIDDetected) {
      window.electronAPI.onRFIDDetected((detectedBarcode: string) => {
        setBarcode(detectedBarcode);
        fetchAndSetProducts(detectedBarcode);
        setBeforeScan(false); // 스캔 완료 상태로 변경
      });
    } else {
      console.error("RFID 인식 오류");
    }
  }, [products]);

  // 상품 삭제 함수
  const removeProduct = (barcode: string) => {
    setScannedProducts((prevScannedProducts) =>
      prevScannedProducts.filter((product) => product.barcode !== barcode)
    );
  };

  // 결제하기 로직 (추후 추가 가능)
  const handlePayment = () => {
    console.log("결제 처리 로직");
  };

  // 취소하기(뒤로가기) 버튼 처리
  const handleCancel = () => {
    router.back(); // 이전 페이지로 돌아가기
  };

  return (
    <div className={styles.container}>
      {beforeScan ? (
        <div className={styles.beforeScan}>
          <h2>상품을 바구니에 담아주세요</h2>
          <div className={styles.cartContainer}>
            <img
              src="/cart.gif" // cart.gif 이미지 표시
              alt="장바구니"
              className={styles.cartImage}
            />
          </div>
        </div>
      ) : loading ? (
        <div className={styles.loading}>
          <h2>상품을 인식 중입니다...</h2>
        </div>
      ) : (
        <div>
          <h2>인식된 바코드: {barcode}</h2>
          {scannedProducts.length > 0 ? (
            scannedProducts.map((product) => (
              <div key={product.id} className={styles.product}>
                <h3>
                  {product.name} x {product.quantity}{" "}
                  <button onClick={() => removeProduct(product.barcode)}>
                    삭제
                  </button>
                </h3>
                <p>가격: {product.price * product.quantity}원</p>
              </div>
            ))
          ) : (
            <p>해당 바코드로 등록된 상품이 없습니다.</p>
          )}

          <div className={styles.actions}>
            <button onClick={handlePayment} className={styles.paymentButton}>
              결제하기
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              취소하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
