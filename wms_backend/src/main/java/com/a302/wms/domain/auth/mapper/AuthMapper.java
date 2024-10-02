package com.a302.wms.domain.auth.mapper;

import com.a302.wms.domain.auth.dto.response.DeviceSignInResponse;
import com.a302.wms.domain.auth.dto.response.UserSignInResponse;
import com.a302.wms.domain.device.dto.DeviceResponse;
import com.a302.wms.domain.user.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public static UserSignInResponse fromUserToken(String accessToken, UserResponse userResponse) {
        return UserSignInResponse.builder()
                .accessToken(accessToken)
                .userResponse(userResponse)
                .build();
    }

    public static DeviceSignInResponse fromDeviceToken(String deviceToken, DeviceResponse deviceResponse) {
        return DeviceSignInResponse.builder()
                .accessToken(deviceToken)
                .deviceResponse(deviceResponse)
                .build();
    }
}
