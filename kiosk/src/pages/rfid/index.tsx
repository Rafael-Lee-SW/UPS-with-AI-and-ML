import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./rfid.module.css";

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
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 상태

  useEffect(() => {
    if (!window.TossPayments) {
      console.error("TossPayments SDK is not loaded.");
    }
  }, []);

  // 결제 처리 함수
  const handleClick = async () => {
    try {
      // TossPayments SDK가 제대로 로드되었는지 확인
      const tosspayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_yZqmkKeP8gxBDajBEZqY3bQRxB9l");
      if (!tosspayments) {
        console.error("TossPayments SDK를 로드하지 못했습니다.");
        return;
      }
      console.log("TossPayments 로드 성공");
  
      await tosspayments.requestPayment("카드", {
        amount: totalPrice,
        orderId: Math.random().toString(36).slice(2),
        orderName: "OFFLINE",
        successUrl: `${window.location.origin}/payment/checkout`,
        failUrl: `${window.location.origin}/payment/Fail`,
        customerName: "고객명",
        customerEmail: "customer@example.com",
      });
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
    }
  };

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
  console.log("바코드의 타입:", typeof barcode); // 바코드의 타입 출력

  products.forEach((product) => {
    console.log("상품 바코드:", product.barcode, "타입:", typeof product.barcode); // 각 상품의 바코드와 타입 출력
  });

  // 바코드를 문자열로 변환해서 비교
  const matchedProduct = products.find(
    (product) => {
      console.log(`비교 - 상품 바코드: ${String(product.barcode)}, 인식된 바코드: ${String(barcode)}`); // 바코드 비교 로그 출력
      return String(product.barcode) === String(barcode); // 바코드를 문자열로 변환하여 비교
    }
  );

  if (matchedProduct) {
    console.log("일치하는 상품을 찾았습니다:", matchedProduct); // 일치하는 상품 콘솔 출력
    setScannedProducts((prevScannedProducts) => {
      const existingProduct = prevScannedProducts.find(
        (product) => String(product.barcode) === String(barcode) // 바코드를 문자열로 변환하여 비교
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
    setTotalPrice((prevTotal) => prevTotal + (matchedProduct.sellingPrice || 0));
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

  // 결제 페이지로 리다이렉트
  const handlePayment = () => {
    handleClick(); // 결제 처리 함수 호출
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

      {scannedProducts.length > 0 ? (
        <div>
          <h2>인식된 바코드: {barcode}</h2>
          {scannedProducts.map((product) => (
            <div key={product.id} className={styles.product}>
              <h3>
                {product.name} x {product.quantity}{" "}
                <button onClick={() => removeProduct(product.barcode)}>삭제</button>
              </h3>
              <p>
                가격: {product.sellingPrice ? product.sellingPrice * product.quantity : 0}원
              </p>
            </div>
          ))}
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
      ) : (
        <p>해당 바코드로 등록된 상품이 없습니다.</p>
      )}
    </div>
  );
}
