package com.a508.wms.product.exception;

import com.a508.wms.util.BaseExceptionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class ProductExceptionHandler {

    @ExceptionHandler(ProductException.class)
    public BaseExceptionResponse productException(ProductException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
