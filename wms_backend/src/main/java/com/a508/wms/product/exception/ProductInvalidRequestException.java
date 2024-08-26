package com.a508.wms.product.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductInvalidRequestException extends IllegalArgumentException {
    private static final String EXCEPTION_MESSAGE_FORMAT=" 잘못된 요청값 = %s : %s ";
    private static final ResponseEnum responseEnum=ResponseEnum.BAD_REQUEST;
    private final String exceptionMessage;

    public ProductInvalidRequestException(String invalidRequestName,Object value){
        exceptionMessage=String.format(EXCEPTION_MESSAGE_FORMAT,invalidRequestName,String.valueOf(value));
    }

    public ResponseEnum getResponseEnum(){
        return responseEnum;
    }
}
