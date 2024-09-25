import axios from 'axios';

// API 요청을 한 곳에서 관리
const API_URL = 'http://j11a302.p.ssafy.io/api';

// 토큰을 검증하는 함수 (storeId는 key로 받아서 사용)
export async function verifyToken(token: string): Promise<{ valid: boolean; products: any[] }> {
  try {
    // body에 key 값을 담아서 POST 요청을 보냄
    const response = await axios.post(`${API_URL}/devices/keys`, { key: token });  // 수정된 API 경로
    return response.data;  // 응답 데이터를 반환
  } catch (error) {
    console.error('키 검증 API 요청 실패:', error);
    return { valid: false, products: [] };  // 실패 시 기본값 반환
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
