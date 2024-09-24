package com.a302.wms.domain.auth.dto.response.auth;

import com.a302.wms.domain.auth.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class CheckCertificationResponseDto extends ResponseDto {

    private CheckCertificationResponseDto(){
        super();
    }
   public static ResponseEntity<CheckCertificationResponseDto> success(){
       CheckCertificationResponseDto responseBody = new CheckCertificationResponseDto();
       return ResponseEntity.status(HttpStatus.OK).body(responseBody);

   }
   public static ResponseEntity<CheckCertificationResponseDto> certificationFail(){
            CheckCertificationResponseDto responseBody = new CheckCertificationResponseDto();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);

   }



}
