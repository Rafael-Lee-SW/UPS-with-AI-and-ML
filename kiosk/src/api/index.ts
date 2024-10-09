import axios from 'axios';

// API URL 설정
const API_URL = 'https://j11a302.p.ssafy.io/api';
let accessToken = ''; // 토큰을 저장할 변수

// 1. 토큰을 저장하는 함수
export function setAuthToken(token: string) {
  accessToken = token; // 메모리 변수에 토큰 저장
  console.log('Authorization Token:', accessToken);
  localStorage.setItem('accessToken', token); // 로컬스토리지에 토큰 저장
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // axios 기본 헤더에 토큰 추가
}

// 2. 상품 리스트와 스토어 이름을 가져오는 함수 (토큰을 받아와 저장)
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
      const token = data.result.accessToken;
      const storeNameFromAPI = data.result.storeName;
      const products = data.result.productResponseList || [];

      // accessToken 저장 (setAuthToken을 사용해 토큰 저장)
      setAuthToken(token);

      // 상품 정보 및 스토어 이름을 로컬스토리지에 저장
      localStorage.setItem('products', JSON.stringify(products));
      localStorage.setItem('storeName', storeNameFromAPI);

      return { valid: true, products, storeName: storeNameFromAPI, accessToken: token };
    } else {
      return { valid: false, products: [], storeName: "", accessToken: "" };
    }
  } catch (error) {
    console.error("상품 조회 API 요청 실패:", error);
    return { valid: false, products: [], storeName: "", accessToken: "" };
  }
}

// 3. 로컬스토리지에 저장된 상품 정보를 가져오는 함수
export function getStoredProducts(): any[] {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : []; // 저장된 상품 정보를 반환
}

// 4. 로컬스토리지에 저장된 스토어 이름을 가져오는 함수
export function getStoredStoreName(): string {
  return localStorage.getItem('storeName') || ''; // 저장된 스토어 이름을 반환
}

// 5. 결제 정보 백엔드로 전송하는 함수
export async function sendPaymentDataToBackend(
  orderId: string, 
  totalPrice: number, 
  payedProducts: any[]
): Promise<void> {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No access token found. Please log in again.');
      return;
    }
    // 전송될 데이터를 콘솔에 출력
    console.log('Sending payment data to backend...');
    console.log('Order ID:', orderId);
    console.log('Total Price:', totalPrice);
    console.log('Payed Products:', payedProducts);
    console.log('Authorization Token:', accessToken);
    
    const response = await axios.post(
      `${API_URL}/payments`, 
      {
        paymentCreateRequestList: payedProducts.map((product) => ({
          barcode: product.barcode,
          productName: product.productName,
          quantity: product.quantity,
          sellingPrice: product.sellingPrice,
        })),
        orderId: orderId,
        totalPrice: totalPrice // 총 결제 금액
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // 저장된 토큰 사용
          'Content-Type': 'application/json',
        }
      }
    );

    // 성공적으로 전송되었을 때의 응답을 콘솔에 출력
    console.log('Payment data sent successfully:', response.data);
  } catch (error) {
    // 오류 발생 시 오류 메시지 출력
    console.error('Failed to send payment data:', error);
  }
}
