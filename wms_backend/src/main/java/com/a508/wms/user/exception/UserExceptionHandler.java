package com.a508.wms.user.exception;

import com.a508.wms.util.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UserExceptionHandler {

    @ExceptionHandler(UserException.class)
    public BaseExceptionResponse userException(UserException e) {
        return new BaseExceptionResponse(e.getResponseEnum());

    }
}
