package com.a302.wms.domain.auth.dto.response;

import lombok.Builder;

@Builder
public record AccessTokenResponse(
        String accessToken
) {}
