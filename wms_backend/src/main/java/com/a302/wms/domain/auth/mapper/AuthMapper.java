package com.a302.wms.domain.auth.mapper;

import com.a302.wms.domain.auth.dto.response.AccessTokenResponse;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public static AccessTokenResponse fromAccessToken(String accessToken) {
        return AccessTokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }
}
