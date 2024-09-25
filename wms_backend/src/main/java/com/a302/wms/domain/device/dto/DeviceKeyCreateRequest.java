package com.a302.wms.domain.device.dto;

import com.a302.wms.global.constant.DeviceTypeEnum;

public record DeviceKeyCreateRequest(
        Long storeId,
        DeviceTypeEnum deviceType
) {
}