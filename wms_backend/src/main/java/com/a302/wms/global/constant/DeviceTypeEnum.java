package com.a302.wms.global.constant;

import lombok.Getter;

@Getter
public enum DeviceTypeEnum {
    CCTV("CCTV"),
    KIOSK("키오스크");

    private String value;

    DeviceTypeEnum(String value) {
        this.value = value;
    }
}
