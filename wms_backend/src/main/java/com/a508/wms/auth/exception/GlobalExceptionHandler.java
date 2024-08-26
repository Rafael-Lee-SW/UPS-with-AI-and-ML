package com.a508.wms.auth.exception;

import com.a508.wms.auth.dto.response.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DuplicatedEmailException.class)
    public ResponseEntity<ResponseDto> handleDuplicatedEmailException(DuplicatedEmailException ex) {
        return ResponseDto.duplicateEmailError();
    }

}
