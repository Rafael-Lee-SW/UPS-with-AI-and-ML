package com.a302.wms.domain.device.dto;

import com.a302.wms.global.constant.DeviceTypeEnum;
import lombok.Builder;

@Builder
public record DeviceResponse(
        Long id,
        Long storeId,
        DeviceTypeEnum deviceType
) {
}
