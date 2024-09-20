package com.a302.wms.util.constant;

import lombok.Getter;

@Getter
public enum ProductFlowType {
    IMPORT("입고"),
    FLOW("이동"),
    MODIFY("수정");

    private final String value;

    ProductFlowType(String value) {
        this.value = value;
    }
}
