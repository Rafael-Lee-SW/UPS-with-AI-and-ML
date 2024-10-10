import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Next.js의 라우터 사용
import { sendPaymentDataToBackend } from "@/api"; // 결제 정보 전송 API 함수
import styles from "./success.module.css"; // CSS 모듈 가져오기

export function SuccessPage() {
  const router = useRouter();
  const { orderId, amount, paymentKey, products: encodedProducts, totalPrice } = router.query; // 쿼리 파라미터 가져오기
  const [products, setProducts] = useState([]); // 파싱된 상품 목록 저장
  const [paymentCompleted, setPaymentCompleted] = useState(false); // 결제 완료 여부

  useEffect(() => {
    // 결제 요청 시 받은 파라미터 값 확인
    const requestData = {
      orderId,
      amount,
      paymentKey,
    };

    async function confirm() {
      // 결제 확인 API 호출
      const response = await fetch("/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 시 실패 페이지로 이동
        router.push(`/payment/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      console.log("결제가 성공적으로 확인되었습니다.");
    }

    // 쿼리 파라미터가 존재할 때만 confirm 함수 호출
    if (orderId && amount && paymentKey) {
      confirm();
    }

    // 인코딩된 products를 디코딩 및 파싱하여 상태에 저장
    if (encodedProducts) {
      const decodedProducts = JSON.parse(decodeURIComponent(encodedProducts));
      setProducts(decodedProducts);
    }
  }, [orderId, amount, paymentKey, encodedProducts, router]);

  useEffect(() => {
    // products가 설정된 후 결제 완료 API 호출
    if (products.length > 0) {
      const paymentCreateRequestList = products.map((product) => ({
        barcode: product.barcode,
        productName: product.productName,
        quantity: product.quantity,
        sellingPrice: product.sellingPrice,
      }));

      const requestData = {
        paymentCreateRequestList,
        orderId: orderId,
        totalPrice: Number(totalPrice),
      };

      // 백엔드로 결제 완료 정보 전송
      sendPaymentDataToBackend(orderId, Number(totalPrice), requestData.paymentCreateRequestList)
        .then((response) => {
          console.log("결제 정보가 백엔드에 성공적으로 전송되었습니다.");
          setPaymentCompleted(true); // 결제 완료 상태 설정
        })
        .catch((error) => {
          console.error("결제 정보 전송 중 오류 발생:", error);
        });
    }
  }, [products, orderId, totalPrice]);

  // 숫자에 , 찍기
  const formatPrice = (price) => {
    const numericPrice = Number(price); // 형변환
  
    if (isNaN(numericPrice)) {
      return "0"; // 형변환에 실패한 경우 기본값 반환
    }
  
    return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div className={styles.resultWrapper}>
      <div className={styles.boxSection}>
        <img src="/successPayment.png" alt="결제 성공 이미지" className={styles.successImage} />
        <h2 className={styles.heading}>결제가 완료되었습니다.</h2>

        <h2>구매 상품 목록</h2>
        <div className={styles.receipt}>
          <ul className={styles.productList}>
            {products.map((product, index) => (
              <li key={index}>
                {product.productName} {product.quantity}개 - {product.sellingPrice}원
              </li>
            ))}
          </ul>
          <hr className={styles.divider} />
          <p className={styles.totalPrice}>{`총 결제 금액: ${formatPrice(totalPrice)}원`}</p>
        </div>

        <button className={styles.mainButton} onClick={() => router.push("/select")}>
          메인 페이지로 이동
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
