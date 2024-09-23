import axios from 'axios';

// API 요청을 한 곳에서 관리
const API_URL = 'http://j11a302.p.ssafy.io/api';

// 토큰을 검증하는 함수
export async function verifyToken(token: string): Promise<{ valid: boolean; products: any[] }> {
  try {
    const response = await axios.post(`${API_URL}/validate-key`, { token });
    return response.data;
  } catch (error) {
    console.error('키 검증 API 요청 실패:', error);
    return { valid: false, products: [] };
  }
}

// 상품 목록을 가져오는 함수
export async function fetchProducts(): Promise<any[]> {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('상품 API 요청 실패:', error);
    return [];
  }
}

// RFID로 상품 정보를 가져오는 함수 추가
export async function fetchProductsByRFID(rfid: string): Promise<any[]> {
  try {
    const response = await axios.post(`${API_URL}/get-products-by-rfid`, { rfid });
    return response.data;
  } catch (error) {
    console.error('RFID 상품 조회 실패:', error);
    return [];
  }
}
