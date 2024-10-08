import axios from 'axios';

const API_URL = 'https://j11a302.p.ssafy.io/api';

// 상품 리스트 가져오는 함수
export async function fetchProducts(deviceOtp: string): Promise<{
  valid: boolean;
  products: any[];
  storeName: string;
  accessToken: string;
}> {
  try {
    const response = await axios.post(`${API_URL}/auths/devices/sign-in`, {
      deviceOtp: deviceOtp,
    });

    const data = response.data;

    if (data.success) {
      // API 응답에서 accessToken과 storeName을 추가로 받아옴
      const accessToken = data.result.accessToken;
      const storeName = data.result.storeName;
      const products = data.result.productResponseList || [];

      return { valid: true, products, storeName, accessToken };
    } else {
      return { valid: false, products: [], storeName: "", accessToken: "" };
    }
  } catch (error) {
    console.error("상품 조회 API 요청 실패:", error);
    return { valid: false, products: [], storeName: "", accessToken: "" };
  }
}

// RFID로 상품 정보를 가져오는 함수
export async function fetchProductsByRFID(rfid: string): Promise<any[]> {
  try {
    const response = await axios.post(`${API_URL}/get-products-by-rfid`, { rfid });
    return response.data.result;
  } catch (error) {
    console.error('RFID 상품 조회 실패:', error);
    return [];
  }
}

// 결제 확인 함수 추가
export async function confirmPayment(orderId: string, amount: number, paymentKey: string): Promise<{ success: boolean; message: string; }> {
  try {
    const response = await axios.post(`${API_URL}/confirm-payment`, { orderId, amount, paymentKey });
    
    if (response.data.success) {
      return { success: true, message: 'Payment confirmed successfully' };
    } else {
      return { success: false, message: response.data.message || 'Payment failed' };
    }
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    return { success: false, message: 'Error occurred during payment confirmation' };
  }
}
