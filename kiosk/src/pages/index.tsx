import { useState } from 'react';
import { useRouter } from 'next/router';
import { verifyToken } from '@/api/index';  // API 함수 호출

export default function Home() {
  const [key, setKey] = useState('');  // key 상태
  const [error, setError] = useState('');  // 에러 상태
  const router = useRouter();  // Next.js 라우터 사용

  // form 제출 시 호출될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // API를 통해 key 검증 요청 (POST 요청으로 body에 key를 보냄)
    const { valid, products } = await verifyToken(key);

    if (valid) {
      // key 검증 성공 시 products 데이터를 함께 전달하여 페이지 이동
      router.push({
        pathname: '/select',
        query: { products: JSON.stringify(products) }  // 쿼리 파라미터로 상품 정보 전달
      });
    } else {
      setError('Invalid key');  // key가 유효하지 않을 때 에러 처리
    }
  };

  return (
    <div>
      <h1>Enter your key</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}  // 입력값을 상태로 저장
          placeholder="Enter key"
        />
        <button type="submit">Submit</button>  {/* 제출 버튼 */}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* 에러 메시지 출력 */}
    </div>
  );
}
