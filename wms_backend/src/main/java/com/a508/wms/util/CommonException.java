package com.a508.wms.util;

import com.a508.wms.product.exception.ProductException;
import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class CommonException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public CommonException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class BadRequestException extends ProductException {

        private static final String MESSAGE_FORMAT = " 입력값: %s";

        BadRequestException(Object o) {
            super(ResponseEnum.PRODUCT_NOT_FOUND,
                String.format(ResponseEnum.PRODUCT_NOT_FOUND.getMessage() + MESSAGE_FORMAT,
                    o.toString()));
        }
    }
}
