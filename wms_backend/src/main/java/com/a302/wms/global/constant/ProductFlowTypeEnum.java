package com.a302.wms.global.constant;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum ProductFlowTypeEnum {
    IMPORT("입고"),
    FLOW("이동"),
    MODIFY("수정");

    private final String value;

    ProductFlowTypeEnum(String value) {
        this.value = value;
    }
}
