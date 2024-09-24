package com.a302.wms.domain.device.dto;

import com.a302.wms.global.constant.DeviceTypeEnum;

public record DeviceCreateRequestDto(
        Long storeId,
        String deviceKey,
        DeviceTypeEnum deviceType
) {
}
