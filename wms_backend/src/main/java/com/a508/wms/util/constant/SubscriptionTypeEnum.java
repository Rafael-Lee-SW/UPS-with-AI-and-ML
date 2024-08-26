package com.a508.wms.util.constant;

import lombok.Getter;

@Getter
public enum SubscriptionTypeEnum {
    BASIC("베이직"), PREMIUM("프리미엄");

    private String value;

    private SubscriptionTypeEnum(String value) {
        this.value = value;
    }
}
