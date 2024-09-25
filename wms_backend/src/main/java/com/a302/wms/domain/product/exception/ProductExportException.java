package com.a302.wms.domain.product.exception;

import com.a302.wms.global.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductExportException extends IllegalArgumentException {
   final ResponseEnum responseEnum=ResponseEnum.BAD_REQUEST;
    private final String exceptionMessage;

    public ProductExportException(String exceptionMessage){
        this.exceptionMessage=exceptionMessage;
    }

    public ResponseEnum getResponseEnum(){
        return responseEnum;
    }
}
