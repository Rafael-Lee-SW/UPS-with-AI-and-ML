package com.a302.wms.user.exception;

import com.a302.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class UserException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public UserException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFountException extends UserException {

       final String MESSAGE_FORMAT = " 사업체 productId: %s";

        NotFountException(Long id) {
            super(ResponseEnum.BUSINESS_NOT_FOUND,
                String.format(ResponseEnum.BUSINESS_NOT_FOUND.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class DeletedException extends UserException {

       final String MESSAGE_FORMAT = " 사업체 productId: %s";

        DeletedException(Long id) {
            super(ResponseEnum.BUSINESS_DELETED,
                String.format(ResponseEnum.BUSINESS_DELETED.getMessage() + MESSAGE_FORMAT, id));
        }
    }
}
