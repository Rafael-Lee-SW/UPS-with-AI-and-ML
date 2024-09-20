package com.a302.wms.domain.kiosk.dto;

import lombok.Builder;

@Builder
public record KioskKeyResponseDto(
        Long id,
        Long storeId,
        String kioskKey
) {
}
