package com.a508.wms.util.constant;

import lombok.Getter;

@Getter
public enum ProductStorageTypeEnum {
    냉동("냉동"),
    냉장("냉장"),
    상온("상온");
    private final String value;

    ProductStorageTypeEnum(String value) {
        this.value = value;
    }

}
