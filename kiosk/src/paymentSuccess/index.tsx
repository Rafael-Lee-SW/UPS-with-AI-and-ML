import { useRouter } from "next/router";

export default function PaymentSuccess() {
  const router = useRouter();
  const { paymentKey, orderId, amount } = router.query;

  return (
    <div>
      <h1>결제가 성공적으로 완료되었습니다.</h1>
      <p>결제 키: {paymentKey}</p>
      <p>주문 ID: {orderId}</p>
      <p>총 금액: {amount}원</p>
    </div>
  );
}
