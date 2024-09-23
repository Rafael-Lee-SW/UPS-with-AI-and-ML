import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await window.electronAPI.login(key);  // Electron API를 통해 키 검증

    if (isValid) {
      window.electronAPI.navigateToPage();  // 키 검증 성공 시 페이지 이동
    } else {
      setError('Invalid key');
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}