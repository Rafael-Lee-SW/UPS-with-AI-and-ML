import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import debounce from "lodash/debounce"; // 디바운스 함수 가져오기
import axios from "axios"; // axios 인스턴스 활용
import styles from "./rfid.module.css";

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

// API 인스턴스 설정
const api = axios.create({
  baseURL: "https://j11a302.p.ssafy.io/api", // API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default function RFIDPage() {
  const router = useRouter();
  const [barcode, setBarcode] = useState<string>(""); // 바코드 상태
  const [products, setProducts] = useState<Product[]>([]); // 전체 상품 정보 상태
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]); // 인식된 상품 리스트
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 상태
  const [totalQuantity, setTotalQuantity] = useState(0); // 총 수량 상태
  const [fadeOut, setFadeOut] = useState(false); // GIF와 텍스트 사라짐 상태

  // 중복 호출 방지를 위한 플래그 관리
  const isProcessingRef = useRef(false);

  useEffect(() => {
    console.log("현재 스캔된 상품 리스트:", scannedProducts);
  }, [scannedProducts]);

  // 쿼리에서 받은 product 데이터를 상태에 저장
  useEffect(() => {
    if (router.query.products) {
      const parsedProducts = JSON.parse(router.query.products as string);
      console.log("파싱된 상품 데이터:", parsedProducts);
      setProducts(parsedProducts);
    } else {
      console.log("router.query.products가 비어있습니다.");
    }
  }, [router.query.products]);

  // 3자리마다 쉼표를 찍는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 상품 인식 및 수량 업데이트 함수
  const fetchAndSetProducts = (barcode: string) => {
    if (isProcessingRef.current) {
      console.log("중복 호출 방지됨");
      return; // 중복 호출 방지
    }

    isProcessingRef.current = true; // 플래그 설정
    console.log(`fetchAndSetProducts 호출됨: ${barcode}`);

    const matchedProduct = products.find(
      (product) => String(product.barcode) === String(barcode)
    );

    if (matchedProduct) {
      setScannedProducts((prevScannedProducts) => {
        // 기존 배열 복사 후 수정 (불변성 유지)
        const updatedProducts = [...prevScannedProducts];

        const existingProductIndex = updatedProducts.findIndex(
          (product) => product.productId === matchedProduct.productId
        );

        if (existingProductIndex !== -1) {
          // 기존 상품 수량을 복사 후 업데이트
          const updatedProduct = {
            ...updatedProducts[existingProductIndex],
            quantity: updatedProducts[existingProductIndex].quantity + 1,
          };

          updatedProducts[existingProductIndex] = updatedProduct; // 업데이트된 상품 다시 배열에 저장

          console.log(
            `기존 상품 수량 증가: ${updatedProduct.productName}, 수량: ${updatedProduct.quantity}`
          );
        } else {
          // 새로운 상품 추가
          updatedProducts.push({ ...matchedProduct, quantity: 1 });
          console.log(`새로운 상품 추가: ${matchedProduct.productName}`);
        }

        return updatedProducts;
      });

      // 총 가격 및 총 수량 업데이트
      setTotalPrice((prevTotal) => prevTotal + (matchedProduct.sellingPrice || 0));
      setTotalQuantity((prevQuantity) => prevQuantity + 1);
      console.log(`총 가격 업데이트: ${totalPrice}, 총 수량 업데이트: ${totalQuantity}`);
    } else {
      console.log("매칭된 상품 없음");
    }

    // isProcessing 플래그 해제
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 300); // 처리 완료 후 플래그 해제
  };

  // RFID 리스너 등록 및 해제 처리
  useEffect(() => {
    // 디바운스를 적용한 RFID 인식 함수
    const debouncedRFIDHandler = debounce((detectedBarcode: string) => {
      if (!isProcessingRef.current) {
        fetchAndSetProducts(detectedBarcode);
      }
    }, 300); // 300ms 동안 중복 호출 방지

    const removeListener = window.electronAPI.onRFIDDetected((detectedBarcode: string) => {
      debouncedRFIDHandler(detectedBarcode);
    });

    return () => {
      if (removeListener) {
        removeListener(); // 중복된 이벤트 리스너 제거
      }
    };
  }, [products]); // products 의존성만으로 등록

  // 상품 제거 함수 (수량 감소 및 0일 때 상품 제거)
  const removeProduct = (barcode: string) => {
    setScannedProducts((prevScannedProducts) => {
      const existingProduct = prevScannedProducts.find(
        (product) => String(product.barcode) === String(barcode)
      );

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          const updatedProducts = prevScannedProducts.map((product) =>
            product.barcode === barcode
              ? { ...product, quantity: product.quantity - 1 }
              : product
          );
          console.log("업데이트된 상품 리스트:", updatedProducts);

          setTotalPrice(
            (prevTotal) => prevTotal - (existingProduct.sellingPrice || 0)
          );
          setTotalQuantity((prevQuantity) => prevQuantity - 1);
          return updatedProducts;
        } else {
          const updatedProducts = prevScannedProducts.filter(
            (product) => product.barcode !== barcode
          );
          console.log("상품 삭제 후 남은 상품 리스트:", updatedProducts);

          setTotalPrice(
            (prevTotal) => prevTotal - (existingProduct.sellingPrice || 0)
          );
          setTotalQuantity((prevQuantity) => prevQuantity - 1);
          return updatedProducts;
        }
      }
      return prevScannedProducts;
    });
  };

  // 결제 페이지로 리다이렉트 - API 요청을 통해 결제 예정인 상품 전송
  const handlePayment = () => {
    const query = {
      products: JSON.stringify(products),
      scanedProducts: encodeURIComponent(JSON.stringify(scannedProducts)),
      totalPrice: totalPrice,
    };

    router.push({
      pathname: "/payment/checkout",
      query,
    });
  };

  const handleCancel = () => {
    router.push("/select");
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2>매장 이름</h2>
      </header>
      <hr className={styles.divider} />
      <div className={`${styles.cartContainer} ${fadeOut ? styles.fadeOut : ""}`}>
        <img src="/cart.gif" alt="장바구니" className={styles.cartImage} />
        <p>상품을 바구니에 넣어주세요</p>
      </div>
      <div className={styles.productsContainer}>
        {scannedProducts.length > 0 ? (
          scannedProducts.map((product, index) => (
            <div
              key={product.productId} // 고유한 productId 사용
              className={`${styles.product} ${
                index % 2 === 0 ? styles.evenProduct : styles.oddProduct
              }`}
            >
              <img
                src={`/${product.barcode}.jpg`}
                alt={product.productName}
                className={styles.productImg}
              />
              <span>
                {product.productName} & {product.barcode}
              </span>

              {/* 수량 조절 */}
              <div className={styles.quantity}>
                <button onClick={() => removeProduct(product.barcode)}>−</button>
                <label>{product.quantity}</label> {/* 수량 표시 */}
                <button onClick={() => fetchAndSetProducts(product.barcode)}>
                  +
                </button>
              </div>

              {/* 가격 */}
              <label className={styles.price}>
                {formatPrice((product.sellingPrice || 0) * product.quantity)} 원
              </label>
            </div>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </div>
      <div className={styles.summaryRight}>
          <div className={styles.totalQuantity}>총 수량: {totalQuantity}개</div>
          <div className={styles.totalPrice}>
            총 결제금액: {formatPrice(totalPrice)}원
          </div>
        </div>
      <div className={styles.summaryFooter}>
        
        <div className={styles.checkoutFooter}>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            주문 취소
          </button>
          <button onClick={handlePayment} className={styles.checkoutBtn}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
