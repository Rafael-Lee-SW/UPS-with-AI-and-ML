package com.a508.wms.user.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class UserException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public UserException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class InvalidValueException extends UserException {

        InvalidValueException() {
            super(ResponseEnum.INVALID_USER_VALUE,
                ResponseEnum.INVALID_USER_VALUE.getMessage());
        }
    }

    public static class DuplicateEmailException extends UserException {

        DuplicateEmailException() {
            super(ResponseEnum.DUPLICATE_EMAIL,
                ResponseEnum.DUPLICATE_EMAIL.getMessage());
        }
    }

    public static class NotFountException extends UserException {

        private static final String MESSAGE_FORMAT = " 사용자 id: %s";

        NotFountException(Long id) {
            super(ResponseEnum.USER_NOT_FOUND,
                String.format(ResponseEnum.USER_NOT_FOUND.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class NotMatchPasswordException extends UserException {

        private static final String MESSAGE_FORMAT = " 입력 비밀번호 : %s";

        NotMatchPasswordException(String password) {
            super(ResponseEnum.PASSWORD_NO_MATCH,
                String.format(ResponseEnum.PASSWORD_NO_MATCH.getMessage() + MESSAGE_FORMAT,
                    password));
        }
    }

    public static class DeletedException extends UserException {

        private static final String MESSAGE_FORMAT = " 사용자 id: %s";

        DeletedException(Long id) {
            super(ResponseEnum.USER_DELETED,
                String.format(ResponseEnum.USER_DELETED.getMessage() + MESSAGE_FORMAT, id));
        }
    }


    public static class NotLoginException extends UserException {

        NotLoginException(String barcodes) {
            super(ResponseEnum.USER_NOT_LOGGED_IN,
                ResponseEnum.USER_NOT_LOGGED_IN.getMessage());
        }
    }

    public static class SameAsOldPasswordException extends UserException {

        SameAsOldPasswordException() {
            super(ResponseEnum.SAME_AS_OLD_PASSWORD,
                ResponseEnum.SAME_AS_OLD_PASSWORD.getMessage());
        }
    }
    public static class InvalidRoleTypeException extends UserException {

        public InvalidRoleTypeException() {
         super(ResponseEnum.INVALID_ROLE_TYPE,
                 ResponseEnum.INVALID_ROLE_TYPE.getMessage());
        }
    }
}
