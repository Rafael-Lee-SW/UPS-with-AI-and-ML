package com.a302.wms.location.exception;

import com.a302.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class LocationException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public LocationException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFountException extends LocationException {

       final String MESSAGE_FORMAT = " 로케이션 productId: %s";

        NotFountException(Long id) {
            super(ResponseEnum.LOCATION_NOT_FOUND,
                String.format(ResponseEnum.LOCATION_NOT_FOUND.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class DeletedException extends LocationException {

       final String MESSAGE_FORMAT = " 로케이션 productId: %s";

        DeletedException(Long id) {
            super(ResponseEnum.LOCATION_DELETED,
                String.format(ResponseEnum.LOCATION_DELETED.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class NotFoundDefaultLocationException extends LocationException {

       final String MESSAGE_FORMAT = " default 로케이션 productId: %s";

        NotFoundDefaultLocationException(Long id) {
            super(ResponseEnum.DEFAULT_LOCATION_NOT_FOUND,
                String.format(ResponseEnum.DEFAULT_LOCATION_NOT_FOUND.getMessage() + MESSAGE_FORMAT,
                    id));
        }
    }

    public static class InvalidStorageType extends LocationException {

       final String MESSAGE_FORMAT = " 로케이션 productId: %s";

        InvalidStorageType(Long id) {
            super(ResponseEnum.INVALID_LOCATION_STORAGE_TYPE,
                String.format(
                    ResponseEnum.INVALID_LOCATION_STORAGE_TYPE.getMessage() + MESSAGE_FORMAT,
                    id));
        }
    }
}
