import { useRouter } from 'next/router'; // 중복된 useRouter 제거
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from "@/api/index";
import styles from './success.module.css';

// Firework 함수 정의
function firework() {
  var duration = 15 * 100;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);

    // 파티클(폭죽)이 두 방향에서 나오도록 설정
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    );
  }, 250);
}

export function SuccessPage() {
  const router = useRouter(); // useRouter 한 번만 import
  const { orderId, amount, paymentKey } = router.query;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { width, height } = useWindowSize(); // 화면 크기

  useEffect(() => {
    async function handlePaymentConfirmation() {
      if (orderId && amount && paymentKey) {
        const result = await confirmPayment(orderId, Number(amount), paymentKey);

        if (result.success) {
          setPaymentSuccess(true);
          firework(); // 결제 성공 시 firework 함수 실행
        } else {
          router.push(`/payment/fail?message=${result.message}`);
        }
      }
    }

    handlePaymentConfirmation();
  }, [orderId, amount, paymentKey]);

  return (
    <div className={styles.resultWrapper}>
      {paymentSuccess && <Confetti width={width} height={height} />} {/* 폭죽 애니메이션 */}
      <div className={styles.boxSection}>
        <h2>🎉 결제가 완료되었습니다 🎉</h2>
        <p>{`주문번호: ${orderId}`}</p>
        <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
        <p>{`Payment Key: ${paymentKey}`}</p>
      </div>
    </div>
  );
}

export default SuccessPage;
