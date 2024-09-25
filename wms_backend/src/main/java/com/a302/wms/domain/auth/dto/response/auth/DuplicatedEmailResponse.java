package com.a302.wms.domain.auth.dto.response.auth;

import com.a302.wms.domain.auth.dto.ResponseCode;
import com.a302.wms.domain.auth.dto.ResponseMessage;
import com.a302.wms.domain.auth.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class DuplicatedEmailResponse extends ResponseDto {

    private DuplicatedEmailResponse() {
        super(ResponseCode.DUPLICATE, ResponseMessage.DUPLICATE);
    }

    public static ResponseEntity<DuplicatedEmailResponse> response() {
        DuplicatedEmailResponse responseBody = new DuplicatedEmailResponse();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody); // HTTP 상태 코드 409 사용
    }
}