import { useEffect, useState } from 'react';

export default function BarcodeRecognition() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const savedProducts = await window.electron.loadProducts();  // 파일에서 상품 정보 불러오기
      setProducts(savedProducts);
    };

    loadProducts();
  }, []);

  return (
    <div>
      <h1>Barcode Recognition</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((product, index) => (
            <li key={index}>
              {product.name} - {product.price} - {product.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
