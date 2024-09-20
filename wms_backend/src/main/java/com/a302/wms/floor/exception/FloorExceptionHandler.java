package com.a302.wms.floor.exception;

import com.a302.wms.util.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class FloorExceptionHandler {

    @ExceptionHandler(FloorException.class)
    public BaseExceptionResponse floorException(FloorException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }

}
