package com.a302.wms.global.constant;

import lombok.Getter;

@Getter
public enum SubscriptionTypeEnum {
    BASIC("베이직"), PREMIUM("프리미엄");

    private String value;

    private SubscriptionTypeEnum(String value) {
        this.value = value;
    }
}
