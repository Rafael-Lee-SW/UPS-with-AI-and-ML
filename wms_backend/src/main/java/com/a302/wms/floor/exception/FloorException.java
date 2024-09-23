package com.a302.wms.floor.exception;

import com.a302.wms.global.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class FloorException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public FloorException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFoundException extends FloorException {

       final String MESSAGE_FORMAT = " 층 productId: %s";

        public NotFoundException(Long id) {
            super(ResponseEnum.FLOOR_NOT_FOUND,
                String.format(ResponseEnum.FLOOR_NOT_FOUND.getMessage(), id));
        }
    }

    public static class DeletedException extends FloorException {

       final String MESSAGE_FORMAT = " 층 productId: %s";

        public DeletedException(Long id) {
            super(ResponseEnum.FLOOR_DELETED,
                String.format(ResponseEnum.FLOOR_DELETED.getMessage(), id));
        }
    }

    public static class NotFoundDefaultFloorException extends FloorException {

       final String MESSAGE_FORMAT = " default 층 productId: %s";

        public NotFoundDefaultFloorException(Long id) {
            super(ResponseEnum.DEFAULT_FLOOR_NOT_FOUND,
                String.format(ResponseEnum.DEFAULT_FLOOR_NOT_FOUND.getMessage(),
                    id));
        }
    }

    public static class InvalidExportType extends FloorException {

       final String MESSAGE_FORMAT = " 층 productId: %s";

        public InvalidExportType(Long id) {
            super(ResponseEnum.INVALID_FLOOR_EXPORT_TYPE,
                String.format(ResponseEnum.INVALID_FLOOR_EXPORT_TYPE.getMessage() ,
                    id));
        }
    }


}
