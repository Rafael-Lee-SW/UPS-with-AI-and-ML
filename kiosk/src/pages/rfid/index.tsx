import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './rfid.module.css';

// 상품 정보 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
  rfid: string;
  quantity: number;
}

// Toss Payments 스크립트 로드 함수
const loadTossPayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment-widget'; // Toss Payments 라이브러리 로드
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export default function RFIDPage() {
  const router = useRouter();
  const [rfid, setRfid] = useState('');  // RFID 상태
  const [products, setProducts] = useState<Product[]>([]);  // 상품 정보 상태
  const [scannedProducts, setScannedProducts] = useState<{ [key: string]: Product }>({});  // 인식된 상품 저장
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState('');  // 오류 메시지 상태
  const [beforeScan, setBeforeScan] = useState(true);  // RFID 스캔 전후 상태
  const [totalPrice, setTotalPrice] = useState(0);  // 총 가격 상태
  const [openModal, setOpenModal] = useState(false);  // 모달 상태

  // 쿼리에서 받은 product 데이터를 상태에 저장
  useEffect(() => {
    if (router.query.products) {
      const parsedProducts = JSON.parse(router.query.products as string);
      setProducts(parsedProducts);
    }
  }, [router.query.products]);

  // RFID 값이 인식되면 호출될 함수
  const fetchAndSetProducts = async (rfidNumber: string) => {
    setLoading(true);
    setError('');  // 기존 오류 메시지 초기화
    try {
      const matchedProduct = products.find((product) => product.rfid === rfidNumber);

      if (matchedProduct) {
        setScannedProducts((prevScannedProducts) => {
          const existingProduct = prevScannedProducts[rfidNumber];

          if (existingProduct) {
            existingProduct.quantity += 1;  // 수량 증가
            setTotalPrice((prevTotal) => prevTotal + existingProduct.price);  // 총 가격 증가
          } else {
            matchedProduct.quantity = 1;  // 처음 인식된 상품은 수량 1로 설정
            setTotalPrice((prevTotal) => prevTotal + matchedProduct.price);  // 총 가격 초기화
          }

          return {
            ...prevScannedProducts,
            [rfidNumber]: existingProduct || matchedProduct,
          };
        });
      }

      setLoading(false);  // 로딩 상태 비활성화
    } catch (error) {
      console.error('상품 정보 로드 중 오류 발생:', error);
      setError('상품 정보를 불러오는 데 실패했습니다.');  // 오류 메시지 설정
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeTossPay = async () => {
      try {
        await loadTossPayScript();  // Toss Payments 스크립트 로드
      } catch (error) {
        console.error('Toss Payments 스크립트 로드 실패:', error);
      }
    };

    initializeTossPay();  // Toss Payments 초기화 호출

    if (window.electronAPI && window.electronAPI.onRFIDDetected) {
      // Electron을 통해 RFID 값이 인식되면 그 값을 설정하고 상품 정보를 불러옴
      window.electronAPI.onRFIDDetected((rfidNumber: string) => {
        if (rfidNumber) {
          setRfid(rfidNumber);
          fetchAndSetProducts(rfidNumber);
          setBeforeScan(false);  // 스캔 후 상태로 변경
        } else {
          setError('RFID 값을 인식할 수 없습니다.');
          setLoading(false);
        }
      });
    } else {
      console.error('electronAPI 또는 onRFIDDetected가 정의되지 않았습니다.');
    }
  }, [products]);  // products가 업데이트될 때마다 호출

  // 결제 API 호출
  const requestPay = () => {
    const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'; // 테스트용 클라이언트 키
    const customerKey = 'customer_unique_id'; // 고객을 구분하기 위한 고유 ID

    if (window.PaymentWidget) {
      const paymentWidget = window.PaymentWidget(clientKey, customerKey);

      paymentWidget.renderPaymentMethods('#payment-method', {
        value: totalPrice,
        currency: 'KRW',
      });

      paymentWidget.requestPayment({
        orderId: `order_${new Date().getTime()}`, // 주문 번호
        orderName: '상품 결제', // 주문 이름
        successUrl: 'http://localhost:3000/success', // 결제 성공 시 리다이렉트될 URL
        failUrl: 'http://localhost:3000/fail', // 결제 실패 시 리다이렉트될 URL
        customerEmail: 'customer@example.com',
        customerName: '홍길동',
      });
    } else {
      console.error('Toss Payments 위젯이 로드되지 않았습니다.');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    router.push('/components');
  };

  return (
    <div className={styles.container}>
      {beforeScan ? (
        <div className={styles.beforeScan}>
          <h2>상품을 바구니에 담아주세요</h2>
          <div className={styles.cartContainer}>
            <img
              src="/cart.gif"
              alt="장바구니"
              className={styles.cartImage}
            />
          </div>
        </div>
      ) : loading ? (
        <div className={styles.loading}>
          <h2>상품을 인식 중입니다...</h2>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <h2>{error}</h2>
        </div>
      ) : (
        <div>
          <h2>인식된 RFID: {rfid}</h2>
          <div className={styles.productList}>
            {Object.values(scannedProducts).length > 0 ? (
              Object.values(scannedProducts).map((product) => (
                <div key={product.id} className={styles.product}>
                  <h3>{product.name}</h3>
                  <p>가격: {product.price}원</p>
                  <p>수량: {product.quantity}개</p>
                  <p>총 가격: {product.quantity * product.price}원</p>
                </div>
              ))
            ) : (
              <p>해당 RFID로 등록된 상품이 없습니다.</p>
            )}
          </div>
          <h3>총 가격: {totalPrice}원</h3>
          <div id="payment-method"></div> {/* 결제 수단을 렌더링할 곳 */}
          <Button onClick={requestPay} variant="contained" color="primary">
            결제하기
          </Button>
        </div>
      )}

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          <DialogTitle style={{ textAlign: 'center', padding: '30px', fontWeight: 'bold' }}>결제가 완료되었습니다.</DialogTitle>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '20px' }}>
            <p>결제 금액: {totalPrice}원</p>
          </div>
          <Button onClick={handleCloseModal} variant="contained" color="primary">
            확인
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
