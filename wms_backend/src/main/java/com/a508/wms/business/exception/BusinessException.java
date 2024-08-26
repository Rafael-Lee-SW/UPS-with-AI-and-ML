package com.a508.wms.business.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class BusinessException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public BusinessException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFountException extends BusinessException {

        private static final String MESSAGE_FORMAT = " 사업체 id: %s";

        NotFountException(Long id) {
            super(ResponseEnum.BUSINESS_NOT_FOUND,
                String.format(ResponseEnum.BUSINESS_NOT_FOUND.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class DeletedException extends BusinessException {

        private static final String MESSAGE_FORMAT = " 사업체 id: %s";

        DeletedException(Long id) {
            super(ResponseEnum.BUSINESS_DELETED,
                String.format(ResponseEnum.BUSINESS_DELETED.getMessage() + MESSAGE_FORMAT, id));
        }
    }
}
