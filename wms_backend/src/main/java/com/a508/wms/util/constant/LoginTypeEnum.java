package com.a508.wms.util.constant;

public enum LoginTypeEnum {
    GENERAL("일반"),
    KAKAO("카카오"),
    NAVER("네이버");

    private final String value;
    LoginTypeEnum(String value) {
        this.value = value;
    }
    public String getValue() {
        return value;
    }
}
