package com.a302.wms.global.constant;

import lombok.Getter;

@Getter
public enum NotificationTypeEnum {

    PRODUCT_FLOW("이동"),
    CRIME_PREVENTION("방범"),
    PAYMENT("결제");

    private final String value;
    NotificationTypeEnum(String value) {
        this.value = value;
    }

}
