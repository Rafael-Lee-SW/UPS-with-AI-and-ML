package com.a508.wms.util;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CommonExceptionHandler {

    @ExceptionHandler(CommonException.class)
    public BaseExceptionResponse globalException(CommonException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
