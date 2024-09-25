package com.a302.wms.domain.device.dto;

import lombok.Builder;

@Builder
public record DeviceDetailedResponse(
        Long id,
        Long storeId,
        String deviceKey
) {
}
