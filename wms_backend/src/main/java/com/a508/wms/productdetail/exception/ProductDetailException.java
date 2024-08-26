package com.a508.wms.productdetail.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductDetailException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public ProductDetailException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFountException extends ProductDetailException {

        private static final String MESSAGE_FORMAT = " 상품 정보 id: %s";

        NotFountException(Long id) {
            super(ResponseEnum.PRODUCT_DETAIL_NOT_FOUND,
                String.format(ResponseEnum.PRODUCT_DETAIL_NOT_FOUND.getMessage() + MESSAGE_FORMAT,
                    id));
        }
    }

    public static class DeletedException extends ProductDetailException {

        private static final String MESSAGE_FORMAT = " 상품 정보 id: %s";

        DeletedException(Long id) {
            super(ResponseEnum.PRODUCT_DETAIL_DELETED,
                String.format(ResponseEnum.PRODUCT_DETAIL_DELETED.getMessage() + MESSAGE_FORMAT,
                    id));
        }
    }
}
