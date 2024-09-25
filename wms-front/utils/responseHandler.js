export const ResponseCode = {
  SUCCESS: "SU",
  VALIDATION_FAIL: "VF",
  DUPLICATE: "DE",
  SIGN_IN_FAIL: "SF",
  CERTIFICATION_FAIL: "CF",
  MAIL_FAIL: "MF",
  DATABASE_ERROR: "DBE",
};

// 응답 코드에 따른 메시지를 정의합니다.
export const ResponseMessage = {
  [ResponseCode.SUCCESS]: "성공했습니다.",
  [ResponseCode.VALIDATION_FAIL]: "입력값 검증에 실패하였습니다.",
  [ResponseCode.DUPLICATE]: "중복된 이메일입니다.",
  [ResponseCode.SIGN_IN_FAIL]: "로그인 정보가 일치하지 않습니다.",
  [ResponseCode.CERTIFICATION_FAIL]: "인증에 실패했습니다.",
  [ResponseCode.MAIL_FAIL]: "메일 전송에 실패했습니다.",
  [ResponseCode.DATABASE_ERROR]: "데이터베이스 오류가 발생했습니다.",
};

// 응답을 처리하는 함수 정의
export function handleResponse(response) {
  const { code, message } = response.data;

  // 응답 코드에 따른 메시지 반환
  if (ResponseMessage[code]) {
    const isSuccess = code === ResponseCode.SUCCESS;
    return { message: ResponseMessage[code], isSuccess };
  } else {
    // 정의되지 않은 코드인 경우의 기본 메시지
    return { message: "알 수 없는 오류가 발생했습니다.", isSuccess: false };
  }
}
