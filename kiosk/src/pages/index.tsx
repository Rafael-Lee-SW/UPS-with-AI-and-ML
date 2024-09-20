import { useState } from 'react';
import { useRouter } from 'next/router';
import { verifyToken } from '@/api/index';  // API 호출

export default function Home() {
  const [key, setKey] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verifyToken(key);  // 키 검증

    if (result.valid) {
      window.electronAPI.saveProducts(result.products);  // Electron에 상품 정보 저장
      router.push('/select');  // 상품 인증 성공 시 페이지 이동
    } else {
      alert('Invalid key');
    }
  };
  return (
    <div>
      <h1>Enter your key</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter key"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
