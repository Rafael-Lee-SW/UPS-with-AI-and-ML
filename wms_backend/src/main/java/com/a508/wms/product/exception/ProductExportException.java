package com.a508.wms.product.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductExportException extends IllegalArgumentException {
    private static final ResponseEnum responseEnum=ResponseEnum.BAD_REQUEST;
    private final String exceptionMessage;

    public ProductExportException(String exceptionMessage){
        this.exceptionMessage=exceptionMessage;
    }

    public ResponseEnum getResponseEnum(){
        return responseEnum;
    }
}
