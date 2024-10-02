package com.a302.wms.domain.auth.dto.response;

import com.a302.wms.domain.user.dto.UserResponse;
import lombok.Builder;

@Builder
public record UserSignInResponse(
        String accessToken,
        UserResponse userResponse
) {
}
