package com.a302.wms.domain.floor.exception;

import com.a302.wms.global.response.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class FloorExceptionHandler {

    @ExceptionHandler(FloorException.class)
    public BaseExceptionResponse floorException(FloorException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }

}
