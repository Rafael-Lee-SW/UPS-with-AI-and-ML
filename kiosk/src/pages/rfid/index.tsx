import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';  // router를 통해 쿼리 값을 받음
import { fetchProductsByRFID } from '@/api/index';  // API 호출
import styles from './rfid.module.css';  // CSS 모듈 가져오기

// 상품 정보 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
  rfid: string;  // RFID 값과 비교하기 위해 상품에 RFID 필드 추가
}

export default function RFIDPage() {
  const router = useRouter();
  const [rfid, setRfid] = useState('');  // RFID 상태
  const [products, setProducts] = useState<Product[]>([]);  // 상품 정보 상태
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);  // RFID로 필터된 상품 정보
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState('');  // 오류 메시지 상태
  const [beforeScan, setBeforeScan] = useState(true);  // RFID 스캔 전후 상태

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
      // 해당 RFID로 일치하는 상품을 필터링
      const matchedProducts = products.filter((product) => product.rfid === rfidNumber);
      setFilteredProducts(matchedProducts);  // 일치하는 상품 정보 설정
      setLoading(false);  // 로딩 상태 비활성화
    } catch (error) {
      console.error('상품 정보 로드 중 오류 발생:', error);
      setError('상품 정보를 불러오는 데 실패했습니다.');  // 오류 메시지 설정
      setLoading(false);
    }
  };

  useEffect(() => {
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className={styles.product}>
                  <h3>{product.name}</h3>
                  <p>가격: {product.price}원</p>
                </div>
              ))
            ) : (
              <p>해당 RFID로 등록된 상품이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
