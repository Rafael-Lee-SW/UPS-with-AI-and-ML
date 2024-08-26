package com.a508.wms.product.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public ProductException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFountException extends ProductException {

        private static final String MESSAGE_FORMAT = " 상품 id: %s";

        public NotFountException(Long id) {
            super(ResponseEnum.PRODUCT_NOT_FOUND,
                String.format(ResponseEnum.PRODUCT_NOT_FOUND.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class DeletedException extends ProductException {

        private static final String MESSAGE_FORMAT = " 상품 id: %s";

        DeletedException(Long id) {
            super(ResponseEnum.PRODUCT_DELETED,
                String.format(ResponseEnum.PRODUCT_DELETED.getMessage() + MESSAGE_FORMAT, id));
        }
    }

    public static class ExportShortageException extends ProductException {

        ExportShortageException() {
            super(ResponseEnum.UNAVAILABLE_EXPORT_PRODUCT_SHORTAGE,
                ResponseEnum.UNAVAILABLE_EXPORT_PRODUCT_SHORTAGE.getMessage());
        }
    }

    public static class ExportMoveException extends ProductException {

        private static final String MESSAGE_FORMAT = " 이동필요 상품 바코드: %s";

        ExportMoveException(String barcodes) {
            super(ResponseEnum.UNAVAILABLE_EXPORT_PRODUCT_MOVE,
                String.format(
                    ResponseEnum.UNAVAILABLE_EXPORT_PRODUCT_MOVE.getMessage() + MESSAGE_FORMAT,
                    barcodes));
        }
    }

    public static class StorageTypeException extends ProductException {

        private static final String MESSAGE_FORMAT = " 상품 id: %s, 로케이션 id: %s";

        StorageTypeException(Long productId, Long locationId) {
            super(ResponseEnum.STORAGE_TYPE_NOT_MATCH,
                String.format(ResponseEnum.STORAGE_TYPE_NOT_MATCH.getMessage() + MESSAGE_FORMAT,
                    productId, locationId));
        }
    }

}
