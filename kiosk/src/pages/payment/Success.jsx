import { useRouter } from 'next/router'; 
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from '../../hooks/useWindowSize'; // 커스텀 훅 가져오기
import styles from './success.module.css';

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
  const router = useRouter();
  const { orderId, amount, paymentKey } = router.query;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { width, height } = useWindowSize(); // 커스텀 훅 사용해 화면 크기 가져오기

  useEffect(() => {
    async function handlePaymentConfirmation() {
      if (orderId && amount && paymentKey) {
        const result = await confirmPayment(orderId, Number(amount), paymentKey);

        if (result.success) {
          setPaymentSuccess(true);
          firework(); // 결제 성공 시 폭죽 애니메이션 실행
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
