package com.a508.wms.util.constant;

public enum PaidTypeEnum {
    CARD("신용카드"),
    TRANSFER("계좌이체"),
    KAKAOPAY("카카오페이"),
    NAVERPAY("네이버페이"),
    TOSSPAY("토스페이");


    private final String value;

    PaidTypeEnum(String value){
        this.value = value;

    }

    public String getValue(){
        return value;
    }
}

