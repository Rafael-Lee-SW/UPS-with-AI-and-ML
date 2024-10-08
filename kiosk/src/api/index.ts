import axios from 'axios';

// API URL 설정
const API_URL = 'https://j11a302.p.ssafy.io/api';
let accessToken = ''; // 토큰을 저장할 변수
let storedProducts: any[] = []; // 상품 정보를 저장할 변수
let storeName = ''; // 스토어 이름을 저장할 변수

// 1. 토큰을 저장하는 함수
export function setAuthToken(token: string) {
  accessToken = token; // 메모리 변수에 토큰 저장
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

      // 상품 정보 및 스토어 이름 저장하는 메서드 호출
      storeProducts(products);
      storeStoreName(storeNameFromAPI);

      return { valid: true, products, storeName: storeNameFromAPI, accessToken: token };
    } else {
      return { valid: false, products: [], storeName: "", accessToken: "" };
    }
  } catch (error) {
    console.error("상품 조회 API 요청 실패:", error);
    return { valid: false, products: [], storeName: "", accessToken: "" };
  }
}

// 3. 상품 정보를 저장하는 메서드
function storeProducts(products: any[]) {
  storedProducts = products; // 상품 정보를 메모리 변수에 저장
  console.log('상품 정보가 저장되었습니다:', storedProducts);
}

// 4. 스토어 이름을 저장하는 메서드
function storeStoreName(name: string) {
  storeName = name; // 스토어 이름을 메모리 변수에 저장
  console.log('스토어 이름이 저장되었습니다:', storeName);
}

// 5. 저장된 상품 정보를 가져오는 메서드
export function getStoredProducts(): any[] {
  return storedProducts; // 저장된 상품 정보를 반환
}

// 6. 저장된 스토어 이름을 가져오는 메서드
export function getStoredStoreName(): string {
  return storeName; // 저장된 스토어 이름을 반환
}

// 7. 결제 정보 백엔드로 전송하는 함수
export async function sendPaymentDataToBackend(
  orderId: string, 
  totalPrice: number, 
  payedProducts: any[]
): Promise<void> {
  try {
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
    console.log('Payment data sent successfully:', response.data);
  } catch (error) {
    console.error('Failed to send payment data:', error);
  }
}
