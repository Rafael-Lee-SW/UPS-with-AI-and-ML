import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import debounce from "lodash/debounce"; // 디바운스 함수 가져오기
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

export default function RFIDPage() {
  const router = useRouter();
  const [barcode, setBarcode] = useState(""); // 바코드 상태
  const [products, setProducts] = useState<Product[]>([]); // 전체 상품 정보 상태
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]); // 인식된 상품 리스트
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 상태
  const [totalQuantity, setTotalQuantity] = useState(0); // 총 수량 상태
  const [fadeOut, setFadeOut] = useState(false); // GIF와 텍스트 사라짐 상태

  useEffect(() => {
    console.log("scannedProducts 상태가 업데이트되었습니다:", scannedProducts);
  }, [scannedProducts]);

  // 쿼리에서 받은 product 데이터를 상태에 저장
  useEffect(() => {
    if (router.query.products) {
      const parsedProducts = JSON.parse(router.query.products as string);
      setProducts(parsedProducts);
    }
  }, [router.query.products]);

  // 3자리마다 쉼표를 찍는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const [isProcessing, setIsProcessing] = useState(false); // 처리 중 여부 상태 추가

  // 상품 인식 및 수량 업데이트 함수
  const fetchAndSetProducts = (barcode: string) => {
    if (isProcessing) return; // 중복 호출 방지
    setIsProcessing(true); // 처리 시작 시 플래그 설정

    console.log(`fetchAndSetProducts 호출됨: ${barcode}`);

    // 제품을 찾음
    const matchedProduct = products.find(
      (product) => String(product.barcode) === String(barcode)
    );

    if (matchedProduct) {
      setScannedProducts((prevScannedProducts) => {
        const existingProduct = prevScannedProducts.find(
          (product) => String(product.barcode) === String(barcode)
        );

        if (existingProduct) {
          console.log(
            `기존 상품 수량 증가 직전: ${existingProduct.productName}, 현재 수량: ${existingProduct.quantity}`
          );

          const updatedProducts = prevScannedProducts.map((product) =>
            product.barcode === barcode
              ? { ...product, quantity: product.quantity + 1 } // 불변성 유지하며 수량 1 증가
              : product
          );
          console.log("업데이트된 상품 리스트:", updatedProducts);
          setIsProcessing(false); // 처리 완료 후 플래그 해제
          return updatedProducts;
        } else {
          console.log(`새로운 상품 추가: ${matchedProduct.productName}`);
          const newProducts = [
            ...prevScannedProducts,
            { ...matchedProduct, quantity: 1 },
          ];
          setFadeOut(true); // 상품 인식 시 GIF와 텍스트 사라짐
          console.log("새로 추가된 상품 리스트:", newProducts);
          setIsProcessing(false); // 처리 완료 후 플래그 해제
          return newProducts;
        }
      });

      // 총 가격 및 총 수량 업데이트
      setTimeout(() => {
        setTotalPrice(
          (prevTotal) => prevTotal + (matchedProduct.sellingPrice || 0)
        );
        setTotalQuantity((prevQuantity) => prevQuantity + 1);
      }, 0);
    } else {
      setIsProcessing(false); // 처리 중인 상태 해제
    }
  };

  // RFID 리스너 등록 및 해제 처리
  useEffect(() => {
    // 디바운스를 적용한 RFID 인식 함수
    const debouncedRFIDHandler = debounce((detectedBarcode: string) => {
      console.log("RFID 인식된 바코드:", detectedBarcode);
      if (!isProcessing) {
        setBarcode(detectedBarcode);
        fetchAndSetProducts(detectedBarcode);
      }
    }, 300); // 300ms 동안 중복 호출 방지

    const removeListener: (() => void) | void =
      window.electronAPI.onRFIDDetected((detectedBarcode: string) => {
        debouncedRFIDHandler(detectedBarcode);
      });

    return () => {
      if (typeof removeListener === "function") {
        removeListener();
      }
    };
  }, [products, isProcessing]);

  // 상품 제거 함수 (수량 감소 및 0일 때 상품 제거)
  const removeProduct = (barcode: string) => {
    setScannedProducts((prevScannedProducts) => {
      const existingProduct = prevScannedProducts.find(
        (product) => String(product.barcode) === String(barcode)
      );

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          // 수량이 1보다 클 때는 수량만 감소
          const updatedProducts = prevScannedProducts.map((product) =>
            product.barcode === barcode
              ? { ...product, quantity: product.quantity - 1 } // 불변성 유지하며 수량 1 감소
              : product
          );
          console.log("업데이트된 상품 리스트:", updatedProducts);

          // 총 가격 및 총 수량 업데이트
          setTotalPrice(
            (prevTotal) => prevTotal - (existingProduct.sellingPrice || 0)
          );
          setTotalQuantity((prevQuantity) => prevQuantity - 1);
          return updatedProducts;
        } else {
          // 수량이 0이 되면 리스트에서 제거
          const updatedProducts = prevScannedProducts.filter(
            (product) => product.barcode !== barcode
          );
          console.log("상품 삭제 후 남은 상품 리스트:", updatedProducts);

          // 총 가격 및 총 수량 업데이트
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

  // 결제 페이지로 리다이렉트
  const handlePayment = () => {
    const query = {
      products: encodeURIComponent(JSON.stringify(scannedProducts)),
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
      <div
        className={`${styles.cartContainer} ${fadeOut ? styles.fadeOut : ""}`}
      >
        <img src="/cart.gif" alt="장바구니" className={styles.cartImage} />
        <p>상품을 바구니에 넣어주세요</p>
      </div>
      <div className={styles.productsContainer}>
        {scannedProducts.map((product, index) => (
          <div
            key={product.productId}
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
        ))}
      </div>
      <div className={styles.summary}>
        <div className={styles.totalQuantity}>총 수량: {totalQuantity}개</div>
        <div className={styles.totalPrice}>
          총 결제금액: {formatPrice(totalPrice)}원
        </div>
      </div>
      <div className={styles.checkoutFooter}>
        <button onClick={handleCancel} className={styles.cancelBtn}>
          주문 취소
        </button>
        <button onClick={handlePayment} className={styles.checkoutBtn}>
          결제하기
        </button>
      </div>
    </div>
  );
}
