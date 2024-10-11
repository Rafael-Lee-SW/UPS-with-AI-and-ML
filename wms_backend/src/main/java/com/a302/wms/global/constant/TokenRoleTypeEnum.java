package com.a302.wms.global.constant;

import com.a302.wms.global.handler.CommonException;
import lombok.Getter;

import static com.a302.wms.global.constant.ResponseEnum.INVALID_TOKEN;

@Getter
public enum TokenRoleTypeEnum {
    USER("user"),
    KIOSK("kiosk"),
    CAMERA("camera");

    private final String value;

    TokenRoleTypeEnum(String value) {
        this.value = value;
    }

    public static TokenRoleTypeEnum fromValue(String value) {
        for (TokenRoleTypeEnum role : TokenRoleTypeEnum.values()) {
            if (role.getValue().equals(value)) {
                return role;
            }
        }
        throw new CommonException(INVALID_TOKEN, null);
    }
}
