package com.a302.wms.user.exception;

import com.a302.wms.global.response.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UserExceptionHandler {

    @ExceptionHandler(UserException.class)
    public BaseExceptionResponse baseExceptionResponse(UserException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
