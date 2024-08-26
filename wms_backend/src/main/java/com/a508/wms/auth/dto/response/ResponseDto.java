package com.a508.wms.auth.dto.response;

import com.a508.wms.auth.common.ResponseCode;
import com.a508.wms.auth.common.ResponseMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@AllArgsConstructor
public class ResponseDto {
    // 응답 코드
    private String code;
    // 응답 메시지
    private String message;

    /**
     * 기본 생성자
     * 성공 코드와 메시지를 기본값으로 설정합니다.
     */
    public ResponseDto() {
        this.code = ResponseCode.SUCCESS;
        this.message = ResponseMessage.SUCCESS;
    }

    /**
     * 데이터베이스 오류 응답을 생성합니다.
     *
     * @return 데이터베이스 오류 응답 엔터티
     */
    public static ResponseEntity<ResponseDto> databaseError() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR, ResponseMessage.DATABASE_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }

    /**
     * 유효성 검사 실패 응답을 생성합니다.
     *
     * @return 유효성 검사 실패 응답 엔터티
     */
    public static ResponseEntity<ResponseDto> validationFail() { // 수정된 부분
        ResponseDto responseBody = new ResponseDto(ResponseCode.VALIDATION_FAIL, ResponseMessage.VALIDATION_FAIL);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    /**
     * 중복된 이메일 오류 응답을 생성합니다.
     *
     * @return 중복된 이메일 오류 응답 엔터티
     */
    public static ResponseEntity<ResponseDto> duplicateEmailError() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE, ResponseMessage.DUPLICATE);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody); // HTTP 상태 코드 409 사용
    }
}
