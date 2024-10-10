package com.a302.wms.global.constant;

public enum LocationTypeEnum {
    LOCATION("로케이션"),
    ENTRANCE("입구"),
    EXIT("출구");

    private final String value;

    LocationTypeEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

}
