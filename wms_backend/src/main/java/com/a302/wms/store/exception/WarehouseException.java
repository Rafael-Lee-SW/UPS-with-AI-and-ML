package com.a302.wms.store.exception;

import com.a302.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class StoreException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public StoreException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFountException extends StoreException {

       final String MESSAGE_FORMAT = " 매장 productId: %s";

        NotFountException(Long id) {
            super(ResponseEnum.WAREHOUSE_NOT_FOUND,
                String.format(ResponseEnum.WAREHOUSE_NOT_FOUND.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class DeletedException extends StoreException {

       final String MESSAGE_FORMAT = " 매장 productId: %s";

        DeletedException(Long id) {
            super(ResponseEnum.WAREHOUSE_DELETED,
                String.format(ResponseEnum.WAREHOUSE_DELETED.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class InvalidStoreTypeException extends StoreException {

       final String MESSAGE_FORMAT = " 매장 productId: %s";

        InvalidStoreTypeException(Long id) {
            super(ResponseEnum.INVALID_WAREHOUSE_TYPE,
                String.format(ResponseEnum.INVALID_WAREHOUSE_TYPE.getMessage() + MESSAGE_FORMAT,
                    id));
        }
    }
}
