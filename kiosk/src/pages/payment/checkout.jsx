import { useRouter } from "next/router";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import styles from "./checkout.module.css"; // CSS 모듈 가져오기

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "EeNPZPYSwnohr7iITJk9n";

// 가격에 3자리마다 쉼표를 붙여주는 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export function CheckoutPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]); // 결제할 상품 목록
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격
  const [ready, setReady] = useState(false); // 결제 준비 상태
  const [widgets, setWidgets] = useState(null); // TossPayments SDK의 widgets

  useEffect(() => {
    if (router.query.scanedProducts && router.query.totalPrice) {
      const decodedScannedProducts = decodeURIComponent(router.query.scanedProducts);
      const decodedTotalPrice = router.query.totalPrice;

      console.log("Scanned Products (decoded): ", decodedScannedProducts);
      console.log("Total Price: ", decodedTotalPrice);

      const parsedProducts = JSON.parse(decodedScannedProducts);
      setProducts(parsedProducts); // 상품 데이터 설정
      setTotalPrice(Number(decodedTotalPrice)); // 총 가격 설정
    }
  }, [router.query]);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey });
      setWidgets(widgets); // 위젯 설정
    }
    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) return;

      // 결제 금액 설정
      await widgets.setAmount({ currency: "KRW", value: totalPrice });

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true); // 결제 준비 완료
    }
    renderPaymentWidgets();
  }, [widgets, totalPrice]);

  return (
    <div className="wrapper">
      <div className="box_section">
        <h2>결제 방식을 선택해 주세요</h2>
        
        <h3>상품 목록</h3>
        <ul>
          {products.map((product) => (
            <li key={product.productId}>
              {product.productName} - {product.quantity}개 -{" "}
              {formatPrice(product.sellingPrice)}원 {/* 3자리 쉼표 적용 */}
            </li>
          ))}
        </ul>
        <h3>총 가격: {formatPrice(totalPrice)}원</h3> {/* 3자리 쉼표 적용 */}

        <div id="payment-method" />
        <div id="agreement" />

        <div className={styles.checkoutFooter}>
          <button className={styles.cancelBtn} onClick={() => router.push("/select")}>
            주문 취소
          </button>
          <button
            className={styles.checkoutBtn}
            disabled={!ready}
            onClick={async () => {
              try {
                console.log("Requesting payment...");

                const encodedProducts = encodeURIComponent(JSON.stringify(products));

                await widgets.requestPayment({
                  orderId: Math.random().toString(36).slice(2),
                  orderName: "총 결제 상품",
                  successUrl: `${window.location.origin}/payment/success?products=${encodedProducts}&totalPrice=${totalPrice}`,
                  failUrl: window.location.origin + "/payment/fail",
                  customerEmail: "customer@example.com",
                  customerName: "고객명",
                  customerMobilePhone: "01012345678",
                });
              } catch (error) {
                console.error("결제 중 오류 발생:", error);
              }
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
