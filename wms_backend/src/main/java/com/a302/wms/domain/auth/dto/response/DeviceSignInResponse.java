package com.a302.wms.domain.auth.dto.response;

import com.a302.wms.domain.device.dto.DeviceResponse;
import lombok.Builder;

@Builder
public record DeviceSignInResponse(
        String accessToken,
        DeviceResponse deviceResponse
) {
}
