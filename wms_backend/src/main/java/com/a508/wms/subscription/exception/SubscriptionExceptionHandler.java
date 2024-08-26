package com.a508.wms.subscription.exception;

import com.a508.wms.util.BaseExceptionResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class SubscriptionExceptionHandler {

    @ExceptionHandler(SubscriptionException.class)
    public BaseExceptionResponse subscriptionException(SubscriptionException e) {
        return new BaseExceptionResponse(e.getResponseEnum());
    }
}
