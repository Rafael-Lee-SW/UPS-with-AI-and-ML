package com.a302.wms.global.constant;

import lombok.Getter;

@Getter
public enum TokenRoleTypeEnum {
    USER("유저"),
    KIOSK("키오스크"),
    CCTV("CCTV");

    private final String value;

    TokenRoleTypeEnum(String value) {
        this.value = value;
    }

}
