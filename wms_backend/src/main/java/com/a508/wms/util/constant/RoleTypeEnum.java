package com.a508.wms.util.constant;

public enum RoleTypeEnum {

    GENERAL("일반"),
    EMPLOYEE("직원"),
    BUSINESS("사장");

    private final String value;
    RoleTypeEnum(String value) {
        this.value = value;
    }
    public String getValue() {
        return value;
    }
}
