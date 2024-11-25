package com.a302.wms.domain.structure.exception;

import com.a302.wms.global.response.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class LocationExceptionHandler {

    @ExceptionHandler(LocationException.class)
    public BaseExceptionResponse locationException(LocationException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
