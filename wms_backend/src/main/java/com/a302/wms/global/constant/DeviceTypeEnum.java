package com.a302.wms.global.constant;

import lombok.Getter;

@Getter
public enum DeviceTypeEnum {
    CAMERA("camera"),
    KIOSK("kiosk");

    private String value;

    DeviceTypeEnum(String value) {
        this.value = value;
    }
}
