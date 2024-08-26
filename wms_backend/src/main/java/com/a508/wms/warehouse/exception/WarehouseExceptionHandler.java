package com.a508.wms.warehouse.exception;

import com.a508.wms.util.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class WarehouseExceptionHandler {

    @ExceptionHandler(WarehouseException.class)
    public BaseExceptionResponse warehouseException(WarehouseException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
