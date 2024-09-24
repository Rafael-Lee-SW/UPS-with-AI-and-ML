package com.a302.wms.domain.device.dto;

import lombok.Builder;

@Builder
public record DeviceKeyResponseDto(
        Long id,
        Long storeId,
        String deviceKey
) {
}
