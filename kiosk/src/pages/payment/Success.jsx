import { useRouter } from "next/router";
import { useEffect } from "react";

export function SuccessPage() {
  const router = useRouter();
  const { orderId, amount, paymentKey } = router.query;

  useEffect(() => {
    // 결제 성공 시 확인 작업 수행
    const requestData = { orderId, amount, paymentKey };

    async function confirmPayment() {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 로직으로 이동
        router.push(`/payment/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // 결제 성공 처리 로직
      console.log("결제 성공:", json);
    }

    if (orderId && amount && paymentKey) {
      confirmPayment();
    }
  }, [orderId, amount, paymentKey]);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${orderId}`}</p>
        <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
        <p>{`Payment Key: ${paymentKey}`}</p>
      </div>
    </div>
  );
}

export default SuccessPage;
