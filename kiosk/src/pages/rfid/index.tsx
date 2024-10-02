import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./rfid.module.css";

// 상품 정보 타입 정의
interface Product {
  id: number;
  name: string;
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

  // 쿼리에서 받은 product 데이터를 상태에 저장하고 터미널에 출력
  useEffect(() => {
    if (router.query.products) {
      const parsedProducts = JSON.parse(router.query.products as string);
      setProducts(parsedProducts);
      console.table(parsedProducts); // 상품 목록을 터미널에 출력
    }
  }, [router.query.products]);



  // RFID 데이터가 인식되면 호출될 함수
  const fetchAndSetProducts = (barcode: string) => {
    console.log("인식된 바코드:", barcode);

    const matchedProduct = products.find(
      (product) => String(product.barcode) === String(barcode)
    );

    if (matchedProduct) {
      setScannedProducts((prevScannedProducts) => {
        const existingProduct = prevScannedProducts.find(
          (product) => String(product.barcode) === String(barcode)
        );

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          matchedProduct.quantity = 1;
          return [...prevScannedProducts, matchedProduct];
        }

        return [...prevScannedProducts];
      });

      setTotalPrice((prevTotal) => prevTotal + (matchedProduct.sellingPrice || 0));
    } else {
      console.log("일치하는 상품이 없습니다.");
    }
  };

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onRFIDDetected) {
      window.electronAPI.onRFIDDetected((detectedBarcode: string) => {
        setBarcode(detectedBarcode);
        fetchAndSetProducts(detectedBarcode);
      });
    } else {
      console.error("RFID 인식 오류");
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
      products: encodeURIComponent(JSON.stringify(scannedProducts)), // 안전한 인코딩 처리
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
    <div className={styles.container}>
      <div className={styles.beforeScan}>
        <h2>상품을 바구니에 담아주세요</h2>
        <div className={styles.cartContainer}>
          <img src="/cart.gif" alt="장바구니" className={styles.cartImage} />
        </div>
      </div>

      {scannedProducts.length > 0 ? (
        <div>
          <h2>인식된 바코드: {barcode}</h2>
          {scannedProducts.map((product) => (
            <div key={product.id} className={styles.product}>
              <h3>
                {product.name} x {product.quantity}
                <button onClick={() => removeProduct(product.barcode)}>삭제</button>
              </h3>
              <p>가격: {product.sellingPrice ? product.sellingPrice * product.quantity : 0}원</p>
            </div>
          ))}
          <h3>총 가격: {totalPrice}원</h3>

          <div className={styles.actions}>
            <button onClick={handlePayment} className={styles.paymentButton}>
              결제하기
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              처음으로
            </button>
          </div>
        </div>
      ) : (
        <p>해당 바코드로 등록된 상품이 없습니다.</p>
      )}
    </div>
  );
}
