package com.a302.wms.domain.product.exception;

import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.product.exception.ProductException;
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
