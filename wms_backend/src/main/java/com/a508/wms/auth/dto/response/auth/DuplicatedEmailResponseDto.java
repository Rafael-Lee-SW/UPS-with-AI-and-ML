package com.a508.wms.auth.dto.response.auth;

import com.a508.wms.auth.common.ResponseCode;
import com.a508.wms.auth.common.ResponseMessage;
import com.a508.wms.auth.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class DuplicatedEmailResponseDto extends ResponseDto {

    private DuplicatedEmailResponseDto() {
        super(ResponseCode.DUPLICATE, ResponseMessage.DUPLICATE);
    }

    public static ResponseEntity<DuplicatedEmailResponseDto> response() {
        DuplicatedEmailResponseDto responseBody = new DuplicatedEmailResponseDto();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody); // HTTP 상태 코드 409 사용
    }
}