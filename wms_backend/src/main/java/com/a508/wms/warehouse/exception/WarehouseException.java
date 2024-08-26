package com.a508.wms.warehouse.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class WarehouseException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public WarehouseException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFountException extends WarehouseException {

        private static final String MESSAGE_FORMAT = " 창고 id: %s";

        NotFountException(Long id) {
            super(ResponseEnum.WAREHOUSE_NOT_FOUND,
                String.format(ResponseEnum.WAREHOUSE_NOT_FOUND.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class DeletedException extends WarehouseException {

        private static final String MESSAGE_FORMAT = " 창고 id: %s";

        DeletedException(Long id) {
            super(ResponseEnum.WAREHOUSE_DELETED,
                String.format(ResponseEnum.WAREHOUSE_DELETED.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class InvalidWarehouseTypeException extends WarehouseException {

        private static final String MESSAGE_FORMAT = " 창고 id: %s";

        InvalidWarehouseTypeException(Long id) {
            super(ResponseEnum.INVALID_WAREHOUSE_TYPE,
                String.format(ResponseEnum.INVALID_WAREHOUSE_TYPE.getMessage() + MESSAGE_FORMAT,
                    id));
        }
    }
}
