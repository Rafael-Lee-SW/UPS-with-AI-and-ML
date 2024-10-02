package com.a302.wms.global.constant;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum CrimePreventionEnum {

    THEFT("절도"),
    BROKEN("파손"),
    FIRE("방화"),
    SMOKE("흡연"),
    FALL("실신");

    private final String value;

    CrimePreventionEnum(String value) {
        this.value = value;
    }
    public static boolean isExist(String value) {

        return Arrays.stream(CrimePreventionEnum.values())
                .anyMatch(crime -> value.toLowerCase().contains(crime.name().toLowerCase()));
    }
}
