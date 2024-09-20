package com.a302.wms.domain.kiosk.mapper;

import com.a302.wms.domain.kiosk.dto.KioskKeyResponseDto;
import com.a302.wms.domain.kiosk.dto.KioskCreateRequestDto;
import com.a302.wms.domain.kiosk.dto.KioskResponseDto;
import com.a302.wms.domain.kiosk.entity.Kiosk;
import com.a302.wms.domain.store.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class KioskMapper {

    public static Kiosk toEntity(KioskCreateRequestDto kioskCreateRequestDto, Store store) {
        return Kiosk.builder()
                .store(store)
                .kioskKey(kioskCreateRequestDto.kioskKey())
                .build();
    }

    public static KioskResponseDto toKioskResponseDto(Kiosk kiosk) {
        return KioskResponseDto.builder()
                .id(kiosk.getId())
                .storeId(kiosk.getStore().getId())
                .build();
    }

    public static KioskKeyResponseDto toKioskKeyDto(Kiosk kiosk) {
        return KioskKeyResponseDto.builder()
                .id(kiosk.getId())
                .storeId(kiosk.getStore().getId())
                .kioskKey(kiosk.getKioskKey())
                .build();
    }
}
