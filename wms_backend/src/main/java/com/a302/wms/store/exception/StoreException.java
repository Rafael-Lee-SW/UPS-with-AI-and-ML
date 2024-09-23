package com.a302.wms.store.exception;

import com.a302.wms.global.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class StoreException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public StoreException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFoundException extends StoreException {

       final String MESSAGE_FORMAT = " 매장 productId: %s";

        NotFoundException(Long id) {
            super(ResponseEnum.STORE_NOT_FOUND,
                String.format(ResponseEnum.STORE_NOT_FOUND.getMessage(), id));
        }
    }

    public static class DeletedException extends StoreException {

       final String MESSAGE_FORMAT = " 매장 productId: %s";

        DeletedException(Long id) {
            super(ResponseEnum.STORE_DELETED,
                String.format(ResponseEnum.STORE_DELETED.getMessage(), id));
        }
    }

    public static class InvalidStoreTypeException extends StoreException {

       final String MESSAGE_FORMAT = " 매장 productId: %s";

        InvalidStoreTypeException(Long id) {
            super(ResponseEnum.INVALID_STORE_TYPE,
                String.format(ResponseEnum.INVALID_STORE_TYPE.getMessage(),
                    id));
        }
    }
}
