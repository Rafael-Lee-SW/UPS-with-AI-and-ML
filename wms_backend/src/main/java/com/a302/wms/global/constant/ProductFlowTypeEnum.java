package com.a302.wms.global.constant;

import lombok.Getter;

@Getter
public enum ProductFlowTypeEnum {
    IMPORT("입고"),
    EXPORT("출고"),
    FLOW("이동");

    private final String value;

    ProductFlowTypeEnum(String value) {
        this.value = value;
    }
}
