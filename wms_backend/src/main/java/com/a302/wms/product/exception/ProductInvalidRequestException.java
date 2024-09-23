package com.a302.wms.product.exception;

import com.a302.wms.global.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductInvalidRequestException extends IllegalArgumentException {
   final String EXCEPTION_MESSAGE_FORMAT=" 잘못된 요청값 = %s : %s ";
   final ResponseEnum responseEnum=ResponseEnum.BAD_REQUEST;
    private final String exceptionMessage;

    public ProductInvalidRequestException(String invalidRequestName,Object value){
        exceptionMessage=String.format(EXCEPTION_MESSAGE_FORMAT,invalidRequestName,String.valueOf(value));
    }

    public ResponseEnum getResponseEnum(){
        return responseEnum;
    }
}
