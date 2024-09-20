package com.a302.wms.global.constant;

import lombok.Getter;

@Getter
public enum StatusEnum {
    INACTIVE("비활성"),
    ACTIVE("활성"),
    DELETED("삭제");

    private final String value;

    StatusEnum(String value) {
        this.value = value;
    }
}
