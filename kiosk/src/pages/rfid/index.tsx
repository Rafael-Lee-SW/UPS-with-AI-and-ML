import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router"; // useRouter를 가져옵니다.
import debounce from "lodash/debounce"; // 디바운스 함수 가져오기
import axios from "axios"; // axios 인스턴스 활용
import styles from "./rfid.module.css"; // CSS 모듈 가져오기

// 상품 정보 타입 정의
interface Product {
  productId: number;
  productName: string;
  price: number;
  barcode: string;
  sku: string;
  quantity: number;
  sellingPrice: number | null;
}

export default function RFIDPage() {
  const router = useRouter(); // useRouter 훅을 사용하여 router 변수 정의

  // **변수** 선언
  const [products, setProducts] = useState<Product[]>([]);
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [storeName, setStoreName] = useState<string>("");

  const isProcessingRef = useRef(false);

  // 상품 인식 및 수량 업데이트 함수
  const fetchAndSetProducts = (barcode: string) => {
    if (isProcessingRef.current) return;
  
    isProcessingRef.current = true;
  
    const matchedProduct = products.find((product) => String(product.barcode) === String(barcode));
  
    if (matchedProduct) {
      setScannedProducts((prevScannedProducts) => {
        const existingProductIndex = prevScannedProducts.findIndex(
          (product) => product.productId === matchedProduct.productId
        );
  
        if (existingProductIndex !== -1) {
          // 기존 수량 증가
          const updatedProducts = [...prevScannedProducts];
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            quantity: updatedProducts[existingProductIndex].quantity + 1,
          };
          return updatedProducts;
        } else {
          // 새로운 상품 추가
          return [...prevScannedProducts, { ...matchedProduct, quantity: 1 }];
        }
      });
  
      setTotalPrice((prevTotal) => prevTotal + (matchedProduct.sellingPrice || 0));
      setTotalQuantity((prevQuantity) => prevQuantity + 1);
    }
  
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 300);
  };

  // 상품 제거 함수
  const removeProduct = (barcode: string) => {
    setScannedProducts((prevScannedProducts) => {
      return prevScannedProducts.reduce((updatedProducts, product) => {
        if (product.barcode === barcode) {
          if (product.quantity > 1) {
            // 수량이 1보다 크면 수량 감소
            updatedProducts.push({ ...product, quantity: product.quantity - 1 });
          }
        } else {
          // 현재 바코드와 다른 상품은 그대로 유지
          updatedProducts.push(product);
        }
        return updatedProducts;
      }, [] as Product[]);
    });
  
    const matchedProduct = products.find((product) => product.barcode === barcode);
    if (matchedProduct) {
      setTotalPrice((prevTotal) => prevTotal - (matchedProduct.sellingPrice || 0));
      setTotalQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    const storedStoreName = localStorage.getItem("storeName");

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
    if (storedStoreName) {
      setStoreName(storedStoreName);
    }
  }, []);

  useEffect(() => {
    const debouncedRFIDHandler = debounce((detectedBarcode: string) => {
      if (!isProcessingRef.current) {
        fetchAndSetProducts(detectedBarcode);
      }
    }, 300);

    const removeListener = window.electronAPI.onRFIDDetected((detectedBarcode: string) => {
      debouncedRFIDHandler(detectedBarcode);
    });

    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, [products]);

  // **HTML 반환**
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2>{storeName}</h2>
      </header>
      <hr className={styles.divider} />
      
      {/* 상단 GIF와 텍스트 영역 */}
      <div className={styles.cartContainer}>
        <img src="/cart.gif" alt="장바구니" className={styles.cartImage} />
        <p>상품을 바구니에 넣어주세요</p>
      </div>

      {/* 중간 상품 인식 영역 */}
      <div className={styles.productsContainer}>
  {scannedProducts.length > 0 ? (
    scannedProducts.map((product, index) => (
      <div
        key={product.productId}
        className={`${styles.product} ${index % 2 === 0 ? styles.evenProduct : styles.oddProduct}`}
      >
        <img src={`/${product.barcode}.jpg`} alt={product.productName} className={styles.productImg} />
        <label className={styles.productName}>{product.productName}</label>
        <div className={styles.quantity}>
          <button onClick={() => removeProduct(product.barcode)}>−</button>
          <label>{product.quantity}</label>
          <button onClick={() => fetchAndSetProducts(product.barcode)}>+</button>
        </div>
        <label className={styles.price}>
          {new Intl.NumberFormat("ko-KR").format((product.sellingPrice || 0) * product.quantity)} 원
        </label>
      </div>
    ))
  ) : (
    <div className={styles.noProducts}>상품이 없습니다.</div>
  )}
</div>

      {/* 하단 총 수량 및 결제 금액 영역 */}

      {/* 푸터 영역 */}
      <div className={styles.summaryFooter}>
  <div className={styles.summury}>
    <div className={styles.summaryRight}>
      <div className={styles.totalQuantity}>총 수량: {totalQuantity}개</div>
      <div className={styles.totalPrice}>
        총 결제금액: {new Intl.NumberFormat("ko-KR").format(totalPrice)}원
      </div>
    </div>
  </div>
  <div className={styles.checkoutFooter}>
    <button onClick={() => router.push("/select")} className={styles.cancelBtn}>
      주문 취소
    </button>
    <button
  onClick={() => {
    const encodedProducts = encodeURIComponent(JSON.stringify(scannedProducts));
    router.push({
      pathname: "/payment/checkout",
      query: {
        scanedProducts: encodedProducts,
        totalPrice: totalPrice,
      },
    });
  }}
  className={styles.checkoutBtn}
>
  결제하기
</button>
          </div>
        </div>
      </div>
  );
}
