package com.a302.wms.global.handler;

import com.a302.wms.global.response.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CommonExceptionHandler {

    @ExceptionHandler(CommonException.class)
    public BaseExceptionResponse globalException(CommonException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
