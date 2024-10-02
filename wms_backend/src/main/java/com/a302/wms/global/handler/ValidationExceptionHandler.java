package com.a302.wms.global.handler;


import com.a302.wms.global.response.BaseExceptionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.a302.wms.global.constant.ResponseEnum.VALIDATION_FAILED;

@Slf4j
@RestControllerAdvice
public class ValidationExceptionHandler {

    /**
     * 유효성 검사 실패 시 처리할 예외 핸들러.
     *
     * @param exception 발생한 예외
     * @return 유효성 검사 실패 응답
     */

    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class})
    public BaseExceptionResponse validationExceptionHandler(Exception exception) {
        log.error("validation exception error: {}",exception.getMessage());
        return new BaseExceptionResponse(VALIDATION_FAILED);
    }

}
