package com.a302.wms.user.exception;

import com.a302.wms.global.constant.ResponseEnum;
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
            super(ResponseEnum.USER_NOT_FOUND,
                String.format(ResponseEnum.USER_NOT_FOUND.getMessage(), id));
        }
    }

    public static class DeletedException extends UserException {

       final String MESSAGE_FORMAT = " 사업체 productId: %s";

        DeletedException(Long id) {
            super(ResponseEnum.USER_DELETED,
                String.format(ResponseEnum.USER_DELETED.getMessage(), id));
        }
    }
}
