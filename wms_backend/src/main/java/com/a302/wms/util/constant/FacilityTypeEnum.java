package com.a302.wms.util.constant;

public enum FacilityTypeEnum {
    STORE("매장"),
    WAREHOUSE("매장");
    private final String value;

    private FacilityTypeEnum(String value) {
        this.value = value;
    }
}
