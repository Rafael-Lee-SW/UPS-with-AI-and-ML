package com.a302.wms.domain.kiosk.dto;

public record KioskCreateRequestDto(
        Long storeId,
        String kioskKey
) {
}
