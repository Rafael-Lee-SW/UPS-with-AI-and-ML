import { useRouter } from "next/router";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const clientKey = "test_ck_yZqmkKeP8gxBDajBEZqY3bQRxB9l";
const customerKey = "test_sk_yZqmkKeP8g70JMxG44l48bQRxB9l";

export function CheckoutPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null); // TossPayments SDK의 widgets

  useEffect(() => {
    if (router.query.products && router.query.totalPrice) {
      // products 쿼리 데이터를 파싱
      const parsedProducts = JSON.parse(decodeURIComponent(router.query.products));
      setProducts(parsedProducts);
      setTotalPrice(Number(router.query.totalPrice));
    }
  }, [router.query]);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey });
      setWidgets(widgets);
    }
    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) return;
      await widgets.setAmount({ currency: "KRW", value: totalPrice });

      await Promise.all([
        widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
        widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
      ]);

      setReady(true);
    }
    renderPaymentWidgets();
  }, [widgets, totalPrice]);

  return (
    <div className="wrapper">
      <div className="box_section">
        <h2>총 가격: {totalPrice}원</h2>
        <h3>상품 목록</h3>
        <ul>
          {products.map((product) => (
            <li key={product.productId}>
              {product.productName} - {product.quantity}개 - {product.sellingPrice}원
            </li>
          ))}
        </ul>

        {/* 결제 UI */}
        <div id="payment-method" />
        <div id="agreement" />

        <button
          className="button"
          disabled={!ready}
          onClick={async () => {
            try {
              await widgets.requestPayment({
                orderId: Math.random().toString(36).slice(2),
                orderName: "총 결제 상품",
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",
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
  );
}
export default CheckoutPage;
