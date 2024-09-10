const fetch = require('node-fetch');  // API 요청을 위한 fetch 모듈

// API 요청을 보내는 기본 함수
async function postRequest(endpoint, data) {
  try {
    const response = await fetch(`http://localhost:3000/api/kiosk/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API 요청 실패:', error);
    return { success: false, error: error.message };
  }
}

// 토큰 검증 함수
async function verifyToken(token) {
  const result = await postRequest('verify-token', { token });
  return result;
}

// 다른 API 요청을 추가할 수 있음 (예: 상품 정보 가져오기)
async function getProductInfo(storeId) {
  const result = await postRequest('get-products', { storeId });
  return result;
}

module.exports = { verifyToken, getProductInfo };
