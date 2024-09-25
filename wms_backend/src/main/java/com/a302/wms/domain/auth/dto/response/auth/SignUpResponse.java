package com.a302.wms.domain.auth.dto.response.auth;

import com.a302.wms.domain.auth.dto.ResponseCode;
import com.a302.wms.domain.auth.dto.ResponseMessage;
import com.a302.wms.domain.auth.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class SignUpResponse extends ResponseDto {
   private SignUpResponse(){
       super();
   }

   public static ResponseEntity<SignUpResponse> success(){
       SignUpResponse responseDto = new SignUpResponse();
       return ResponseEntity.status(HttpStatus.OK).body(responseDto);

   }
   public static ResponseEntity<ResponseDto> duplicateId(){
       ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE, ResponseMessage.DUPLICATE);
       return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);

   }

    public static ResponseEntity<ResponseDto> certificateFail(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.CERTIFICATION_FAIL, ResponseMessage.CERTIFICATION_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);

    }
}
