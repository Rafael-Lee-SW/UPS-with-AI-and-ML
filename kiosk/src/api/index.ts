import axios from 'axios';

const API_URL = 'https://j11a302.p.ssafy.io/api';

// 상품 리스트 가져오는 함수
export async function fetchProducts(storeId: string): Promise<{ valid: boolean; products: any[] }> {
  try {
    // storeId를 포함한 GET 요청
    const response = await axios.get(`${API_URL}/stores/${storeId}/products`);
    const data = response.data;
    
    if (data.success) {
      return { valid: true, products: data.result };  // response.result에서 데이터 반환
    } else {
      return { valid: false, products: [] };  // 실패 시 빈 배열 반환
    }
  } catch (error) {
    console.error('상품 조회 API 요청 실패:', error);
    return { valid: false, products: [] };  // 실패 시 기본값 반환
  }
}

// RFID로 상품 정보를 가져오는 함수
export async function fetchProductsByRFID(rfid: string): Promise<any[]> {
  try {
    const response = await axios.post(`${API_URL}/get-products-by-rfid`, { rfid });
    return response.data.result;  // RFID로 상품 정보를 받아옴
  } catch (error) {
    console.error('RFID 상품 조회 실패:', error);
    return [];
  }
}
