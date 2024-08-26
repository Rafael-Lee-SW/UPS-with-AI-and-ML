package com.a508.wms.product.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductInvalidException extends ProductException {

    public static final String EXCEPTION_MESSAGE = "Invalid Exception by ";

    public ProductInvalidException(ResponseEnum responseEnum, String message) {
        super(responseEnum, EXCEPTION_MESSAGE + message);
    }

    public static class InputException extends ProductInvalidException {

        InputException() {
            super(ResponseEnum.BAD_REQUEST, "Input value");
        }
    }
}
