import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import styles from "./rfid.module.css";

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
  const [barcode, setBarcode] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // 중복 호출 방지를 위해 처리 중 상태 추가
  const [isProcessing, setIsProcessing] = useState(false);

  // 상태 업데이트 시마다 콘솔에 출력
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 상품 인식 및 수량 업데이트 함수
  const fetchAndSetProducts = (barcode: string) => {
    if (isProcessing) return; // 중복 호출 방지
    setIsProcessing(true); // 처리 중 플래그 설정

    console.log(`fetchAndSetProducts 호출됨: ${barcode}`);

    // 바코드와 일치하는 상품 찾기
    const matchedProduct = products.find(
      (product) => String(product.barcode) === String(barcode)
    );

    if (matchedProduct) {
      setScannedProducts((prevScannedProducts) => {
        const existingProduct = prevScannedProducts.find(
          (product) => String(product.barcode) === String(barcode)
        );

        if (existingProduct) {
          // 기존 상품이 있으면 수량 증가
          console.log(
            `기존 상품 수량 증가 직전: ${existingProduct.productName}, 현재 수량: ${existingProduct.quantity}`
          );
          const updatedProducts = prevScannedProducts.map((product) =>
            product.barcode === barcode
              ? { ...product, quantity: product.quantity + 1 } // 수량 1 증가
              : product
          );
          console.log("업데이트된 상품 리스트:", updatedProducts);
          setIsProcessing(false); // 처리 완료 후 플래그 해제
          return updatedProducts;
        } else {
          // 새로운 상품 추가
          console.log(`새로운 상품 추가: ${matchedProduct.productName}`);
          const newProducts = [
            ...prevScannedProducts,
            { ...matchedProduct, quantity: 1 }, // 수량 1로 추가
          ];
          console.log("새로 추가된 상품 리스트:", newProducts);
          setIsProcessing(false); // 처리 완료 후 플래그 해제
          return newProducts;
        }
      });

      // 총 가격 및 총 수량 업데이트
      setTotalPrice(
        (prevTotal) => prevTotal + (matchedProduct.sellingPrice || 0)
      );
      setTotalQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      setIsProcessing(false); // 처리 중이 아니라고 설정
    }
  };

  // RFID 리스너 등록 및 해제 처리
  useEffect(() => {
    const debouncedRFIDHandler = debounce((detectedBarcode: string) => {
      console.log("RFID 인식된 바코드:", detectedBarcode);
      setBarcode(detectedBarcode);
      fetchAndSetProducts(detectedBarcode); // 상품 인식 및 업데이트 호출
    }, 300);

    const removeListener = window.electronAPI.onRFIDDetected(
      (detectedBarcode: string) => {
        debouncedRFIDHandler(detectedBarcode);
      }
    );

    return () => {
      if (typeof removeListener === "function") {
        removeListener();
      }
    };
  }, [products]);

  // 상품 제거 함수
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
          setTotalPrice(
            (prevTotal) => prevTotal - (existingProduct.sellingPrice || 0)
          );
          setTotalQuantity((prevQuantity) => prevQuantity - 1);
          return updatedProducts;
        } else {
          const updatedProducts = prevScannedProducts.filter(
            (product) => product.barcode !== barcode
          );
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

            <div className={styles.quantity}>
              <button onClick={() => removeProduct(product.barcode)}>−</button>
              <label>{product.quantity}</label> {/* 수량 표시 */}
              <button onClick={() => fetchAndSetProducts(product.barcode)}>
                +
              </button>
            </div>

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
