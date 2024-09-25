package com.a302.wms.domain.auth.dto.response.auth;

import com.a302.wms.domain.auth.dto.ResponseCode;
import com.a302.wms.domain.auth.dto.ResponseMessage;
import com.a302.wms.domain.auth.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class EmailCertificationResponse extends ResponseDto {

    private EmailCertificationResponse() {
        super();
    }

    public static ResponseEntity<EmailCertificationResponse> success() {
        EmailCertificationResponse responseBody = new EmailCertificationResponse();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
    public static ResponseEntity<ResponseDto> duplicatedId() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE, ResponseMessage.DUPLICATE);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    public static ResponseEntity<ResponseDto> mailSendFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.MAIL_FAIL, ResponseMessage.MAIL_FAIL);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
