package com.a302.wms.domain.kiosk.dto;

import lombok.Builder;

@Builder
public record KioskResponseDto(
        Long id,
        Long storeId
) {
}
