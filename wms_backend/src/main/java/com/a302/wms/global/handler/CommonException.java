package com.a302.wms.global.handler;

import com.a302.wms.global.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class CommonException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public CommonException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

}
