import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [key, setKey] = useState('');  // 키 값 상태 관리
  const router = useRouter();          // Next.js 라우터 사용

  // 키 값 입력 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);  // 입력된 값을 상태에 저장
  };

  // 키 값을 서버로 전송하여 상품 정보를 저장하고 페이지를 이동
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // 기본 form 제출 동작 방지
    try {
      const response = await fetch('/api/validate-key', {  // 로컬 API 호출
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),  // 입력된 키 값을 서버로 전송
      });

      if (response.ok) {
        const data = await response.json();  // 서버로부터 상품 데이터를 받음
        window.electron.saveProducts(data.products);  // Electron 파일 시스템에 상품 정보 저장
        router.push('/select');  // 상품 인증 성공 시, 선택 페이지로 이동
      } else {
        alert('Invalid key');  // 인증 실패 시 경고 메시지 출력
      }
    } catch (error) {
      console.error('Error:', error);  // 에러 처리
    }
  };

  return (
    <div>
      <h1>Enter your key</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={key}
          onChange={handleChange}  
          placeholder="Enter key"
        />
        <button type="submit">Submit</button>  
      </form>
    </div>
  );
}