import { useEffect, useState } from 'react';
import { fetchProductsByRFID } from '@/api/index';  // API 호출
import styles from './rfid.module.css';  // CSS 모듈 가져오기

// 상품 정보 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
}

export default function RFIDPage() {
  const [rfid, setRfid] = useState('');  // RFID 상태
  const [products, setProducts] = useState<Product[]>([]);  // 상품 정보 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState('');  // 오류 메시지 상태

  // RFID 값이 인식되면 호출될 함수
  const fetchAndSetProducts = async (rfidNumber: string) => {
    setLoading(true);
    setError('');  // 기존 오류 메시지 초기화
    try {
      const products: Product[] = await fetchProductsByRFID(rfidNumber);  // API 호출
      setProducts(products);  // 상품 정보 설정
      setLoading(false);  // 로딩 상태 비활성화
    } catch (error) {
      console.error('상품 정보 로드 중 오류 발생:', error);
      setError('상품 정보를 불러오는 데 실패했습니다.');  // 오류 메시지 설정
      setLoading(false);
    }
  };

  useEffect(() => {
    // Electron을 통해 RFID 값이 인식되면 그 값을 설정하고 상품 정보를 불러옴
    window.electronAPI.onRFIDDetected((rfidNumber: string) => {
      if (rfidNumber) {
        setRfid(rfidNumber);
        fetchAndSetProducts(rfidNumber);
      } else {
        setError('RFID 값을 인식할 수 없습니다.');
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
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
            {products.length > 0 ? (
              products.map((product) => (
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
