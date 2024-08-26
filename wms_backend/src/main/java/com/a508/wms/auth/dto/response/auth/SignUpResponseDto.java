package com.a508.wms.auth.dto.response.auth;

import com.a508.wms.auth.common.ResponseCode;
import com.a508.wms.auth.common.ResponseMessage;
import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.auth.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class SignUpResponseDto extends ResponseDto {
   private SignUpResponseDto(){
       super();
   }

   public static ResponseEntity<SignUpResponseDto> success(){
       SignUpResponseDto responseDto = new SignUpResponseDto();
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
