import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./rfid.module.css";

// 상품 정보 타입 정의
interface Product {
  productId: number;
  productName: string;  // 상품명은 productName으로 수정
  price: number;
  barcode: string;
  sku: string;
  quantity: number;
  sellingPrice: number | null;
}

export default function RFIDPage() {
  const router = useRouter();
  const [barcode, setBarcode] = useState(""); // 바코드 상태
  const [products, setProducts] = useState<Product[]>([]); // 전체 상품 정보 상태
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]); // 인식된 상품 리스트
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 상태

  // 쿼리에서 받은 product 데이터를 상태에 저장
  useEffect(() => {
    if (router.query.products) {
      const parsedProducts = JSON.parse(router.query.products as string);
      setProducts(parsedProducts);
    }
  }, [router.query.products]);

  // 3자리마다 쉼표를 찍는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // RFID 데이터가 인식되면 호출될 함수
  const fetchAndSetProducts = (barcode: string) => {
    const matchedProduct = products.find(
      (product) => String(product.barcode) === String(barcode)
    );

    if (matchedProduct) {
      setScannedProducts((prevScannedProducts) => {
        const existingProduct = prevScannedProducts.find(
          (product) => String(product.barcode) === String(barcode)
        );

        if (existingProduct) {
          existingProduct.quantity += 1;  // 이미 바구니에 존재하는 상품일 경우 수량 증가
        } else {
          matchedProduct.quantity = 1;   // 새로운 상품일 경우 수량을 1로 설정
          return [...prevScannedProducts, matchedProduct];
        }

        return [...prevScannedProducts];
      });

      setTotalPrice((prevTotal) => prevTotal + (matchedProduct.sellingPrice || 0));
    }
  };

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onRFIDDetected) {
      window.electronAPI.onRFIDDetected((detectedBarcode: string) => {
        setBarcode(detectedBarcode);
        fetchAndSetProducts(detectedBarcode);
      });
    }
  }, [products]);

  const removeProduct = (barcode: string) => {
    setScannedProducts((prevScannedProducts) => {
      const updatedProducts = prevScannedProducts.filter(
        (product) => product.barcode !== barcode
      );
      const updatedTotalPrice = updatedProducts.reduce(
        (total, product) =>
          total + (product.sellingPrice || 0) * product.quantity,
        0
      );
      setTotalPrice(updatedTotalPrice);
      return updatedProducts;
    });
  };

  // 결제 페이지로 리다이렉트
  const handlePayment = () => {
    const query = {
      products: encodeURIComponent(JSON.stringify(scannedProducts)),
      totalPrice: totalPrice,
    };

    router.push({
      pathname: '/payment/checkout',
      query,
    });
  };

  const handleCancel = () => {
    router.push("/select");
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2>상품을 바구니에 담아주세요</h2>
        <div className={styles.cartContainer}>
          <img src="/cart.gif" alt="장바구니" className={styles.cartImage} />
        </div>
      </header>

      <div className={styles.checkoutContainer}>
        {scannedProducts.length > 0 ? (
          <div className="card cart">
            <label className={styles.title}>장바구니</label>
            <div className={styles.products}>
              {scannedProducts.map((product) => (
                <div key={product.productId} className={styles.product}>  {/* key로 productId 사용 */}
                  <svg fill="none" viewBox="0 0 60 60" height="60" width="60" xmlns="http://www.w3.org/2000/svg">
                    <rect fill="#FFF6EE" rx="8.25" height="60" width="60"></rect>
                  </svg>
                  <div>
                    {/* 3. 상품 이름을 올바르게 출력 (productName 사용) */}
                    <span>{product.productName}</span> 
                    <p>{product.sku}</p>
                  </div>
                  <div className={styles.quantity}>
                    <button onClick={() => removeProduct(product.barcode)}>
                      <svg fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#47484b" d="M20 12L4 12"></path>  {/* camelCase 속성 사용 */}
                      </svg>
                    </button>
                    <label>{product.quantity}</label>
                    <button onClick={() => fetchAndSetProducts(product.barcode)}>
                      <svg fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#47484b" d="M12 4V20M20 12H4"></path>  {/* camelCase 속성 사용 */}
                      </svg>
                    </button>
                  </div>
                  <label className={styles.price}>₩{formatPrice((product.sellingPrice || 0) * product.quantity)}</label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>해당 바코드로 등록된 상품이 없습니다.</p>
        )}

        {scannedProducts.length > 0 && (
          <div className="card checkout">
            <label className={styles.title}>결제</label>
            <div className={styles.details}>
              <span>총 가격:</span>
              <span>₩{formatPrice(totalPrice)}</span>
            </div>
            <div className={styles.checkoutFooter}>
              <button onClick={handlePayment} className={styles.checkoutBtn}>
                결제하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
