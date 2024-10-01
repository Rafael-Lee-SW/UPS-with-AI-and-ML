import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./rfid.module.css";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

// 상품 정보 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  sku: string;
  quantity: number;
  sellingPrice: number | null;
}

export default function RFIDPage() {
  const router = useRouter();
  const [barcode, setBarcode] = useState(""); // 바코드 상태
  const [products, setProducts] = useState<Product[]>([]); // 전체 상품 정보 상태
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]); // 인식된 상품 리스트
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 상태

  // 쿼리에서 받은 product 데이터를 상태에 저장하고 터미널에 출력
  useEffect(() => {
    if (router.query.products) {
      const parsedProducts = JSON.parse(router.query.products as string);
      setProducts(parsedProducts);
      console.table(parsedProducts); // 상품 목록을 터미널에 출력
    }
  }, [router.query.products]);

  // RFID 데이터가 인식되면 호출될 함수
  const fetchAndSetProducts = (barcode: string) => {
    console.log("인식된 바코드:", barcode); // 바코드가 인식되면 콘솔에 출력

    const matchedProduct = products.find(
      (product) => String(product.barcode) === barcode // 문자열로 변환해서 비교
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
          return [...prevScannedProducts, matchedProduct]; // 상품 추가
        }

        return [...prevScannedProducts]; // 새로운 리스트 반환
      });

      // 총 가격 계산
      setTotalPrice(
        (prevTotal) => prevTotal + (matchedProduct.sellingPrice || 0)
      );
    } else {
      console.log("일치하는 상품이 없습니다."); // 일치하는 상품이 없을 경우 콘솔에 메시지 출력
    }
  };

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onRFIDDetected) {
      window.electronAPI.onRFIDDetected((detectedBarcode: string) => {
        setBarcode(detectedBarcode);
        fetchAndSetProducts(detectedBarcode);
      });
    } else {
      console.error("RFID 인식 오류");
    }
  }, [products]);

  // 상품 삭제 함수
  const removeProduct = (barcode: string) => {
    setScannedProducts((prevScannedProducts) => {
      const updatedProducts = prevScannedProducts.filter(
        (product) => product.barcode !== barcode
      );
      // 총 가격 업데이트
      const updatedTotalPrice = updatedProducts.reduce(
        (total, product) =>
          total + (product.sellingPrice || 0) * product.quantity,
        0
      );
      setTotalPrice(updatedTotalPrice);

      return updatedProducts;
    });
  };

  // 결제하기 로직 (토스페이먼츠 연동)
  const handlePayment = async () => {
    try {
      const tossPayments: any = await loadTossPayments(
        "test_ck_yZqmkKeP8gxBDajBEZqY3bQRxB9l"
      ); // 클라이언트 키

      tossPayments.requestPayment("카드", {
        amount: totalPrice, // 총 결제 금액
        orderId: `order-${new Date().getTime()}`, // 주문 ID는 고유값
        orderName: "RFID 상품 결제",
        successUrl: `${window.location.origin}/paymentSuccess`, // 성공 시 리다이렉트 URL
        failUrl: `${window.location.origin}/fail`, // 실패 시 리다이렉트 URL
        customerName: "고객 이름", // 실제 적용될 고객 정보
        customerEmail: "customer@example.com",
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    }
  };

  // 취소하기(처음으로 돌아가기) 버튼 처리
  const handleCancel = () => {
    router.push("/select"); // 결제 취소 후 /select로 이동
  };

  return (
    <div className={styles.container}>
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

      {loading ? (
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
                <p>
                  가격:{" "}
                  {product.sellingPrice
                    ? product.sellingPrice * product.quantity
                    : 0}
                  원
                </p>
              </div>
            ))
          ) : (
            <p>해당 바코드로 등록된 상품이 없습니다.</p>
          )}

          <h3>총 가격: {totalPrice}원</h3>

          <div className={styles.actions}>
            <button onClick={handlePayment} className={styles.paymentButton}>
              결제하기
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              처음으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
