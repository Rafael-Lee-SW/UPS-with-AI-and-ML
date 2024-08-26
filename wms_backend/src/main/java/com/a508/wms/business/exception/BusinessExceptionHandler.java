package com.a508.wms.business.exception;

import com.a508.wms.util.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BusinessExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public BaseExceptionResponse baseExceptionResponse(BusinessException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
