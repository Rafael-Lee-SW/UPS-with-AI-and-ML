package com.a508.wms.location.exception;

import com.a508.wms.util.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class LocationExceptionHandler {

    @ExceptionHandler(LocationException.class)
    public BaseExceptionResponse locationException(LocationException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
