package com.a302.wms.domain.kiosk.dto;

import lombok.Builder;

@Builder
public record KioskDeleteRequestDto(
        Long kioskId,
        Long storeId,
        String kioskKey
) {
}
