package com.a508.wms.util.constant;

public enum FacilityTypeEnum {
    STORE("매장"),
    WAREHOUSE("창고");
    private final String value;

    private FacilityTypeEnum(String value) {
        this.value = value;
    }
}
