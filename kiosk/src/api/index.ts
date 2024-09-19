import axios from 'axios';

// API 요청을 한 곳에서 관리
const API_URL = 'http://j11a302.p.ssafy.io/api';

// `token`의 타입을 명시 (string 타입으로 가정)
async function verifyToken(token: string): Promise<{ valid: boolean; products: any[] }> {
  try {
    const response = await axios.post(`${API_URL}/verify`, { token });
    return response.data;
  } catch (error) {
    console.error('키 검증 API 요청 실패:', error);
    return { valid: false, products: [] };
  }
}

// 상품 목록을 가져오는 함수
async function fetchProducts(): Promise<any[]> {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('상품 API 요청 실패:', error);
    return [];
  }
}

export { verifyToken, fetchProducts };
