package com.a302.wms.domain.auth.dto;

import lombok.Builder;

@Builder
public record Tokens(
        String accessToken,
        String refreshToken
) {

}
