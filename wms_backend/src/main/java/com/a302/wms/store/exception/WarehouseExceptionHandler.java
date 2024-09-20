package com.a302.wms.store.exception;

import com.a302.wms.util.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class StoreExceptionHandler {

    @ExceptionHandler(StoreException.class)
    public BaseExceptionResponse warehouseException(StoreException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
