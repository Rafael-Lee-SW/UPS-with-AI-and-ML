package com.a302.wms.global.constant;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum ProductFlowTypeEnum {
    IMPORT("입고"),
    FLOW("이동"),
    MODIFY("수정");

    private final String value;

    ProductFlowTypeEnum(String value) {
        this.value = value;
    }
    /**
     * 매개변수로 주어지는 "value"의 값이 "import","flow","modify" 중 하나인지 확인하는 메서드
     *
     * @param value : 범죄 종류인지 확인할 문자열
     * @return 범죄 종류 중 하나라면 true, 아니면 false
     */
    public static boolean isExist(String value) {
        return Arrays.stream(ProductFlowTypeEnum.values())
                .anyMatch(flow -> value.equalsIgnoreCase(flow.name()));
    }
}
