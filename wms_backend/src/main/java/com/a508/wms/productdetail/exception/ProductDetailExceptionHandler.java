package com.a508.wms.productdetail.exception;

import com.a508.wms.util.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ProductDetailExceptionHandler {

    @ExceptionHandler(ProductDetailException.class)
    public BaseExceptionResponse productDetailException(ProductDetailException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
