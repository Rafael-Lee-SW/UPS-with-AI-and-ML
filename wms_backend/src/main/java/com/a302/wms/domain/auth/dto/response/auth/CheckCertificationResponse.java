package com.a302.wms.domain.auth.dto.response.auth;

import com.a302.wms.domain.auth.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class CheckCertificationResponse extends ResponseDto {

    private CheckCertificationResponse(){
        super();
    }
   public static ResponseEntity<CheckCertificationResponse> success(){
       CheckCertificationResponse responseBody = new CheckCertificationResponse();
       return ResponseEntity.status(HttpStatus.OK).body(responseBody);

   }
   public static ResponseEntity<CheckCertificationResponse> certificationFail(){
            CheckCertificationResponse responseBody = new CheckCertificationResponse();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);

   }



}
