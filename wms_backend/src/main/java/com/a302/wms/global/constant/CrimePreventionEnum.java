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

    /**
     * 매개변수로 주어지는 "value"의 값이 "theft", "broken", "fire", "smoke", "fall" 중 하나인지 확인하는 메서드
     *
     * @param value : 범죄 종류인지 확인할 문자열
     * @return 범죄 종류 중 하나라면 true, 아니면 false
     */
    public static boolean isExist(String value) {
        return Arrays.stream(CrimePreventionEnum.values())
                .anyMatch(crime -> value.equalsIgnoreCase(crime.name()));
    }

    /**
     * 주어진 문자열이 열거형 상수 중 하나와 일치할 때 해당 상수의 value를 반환하는 메서드
     *
     * @param key : 확인할 문자열 (예: "theft")
     * @return 해당 상수의 value (예: "절도"), 일치하는 상수가 없으면 null 반환
     */
    public static String getCrimeValue(String key) {
        return Arrays.stream(CrimePreventionEnum.values())
                .filter(crime -> crime.name().equalsIgnoreCase(key))
                .map(CrimePreventionEnum::getValue)
                .findFirst()
                .orElse(null);
    }
}
