package com.a302.wms.domain.store.dto.store;

import com.a302.wms.domain.location.dto.LocationResponseDto;
import com.a302.wms.domain.store.dto.wall.WallResponseDto;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record StoreDetailResponseDto(
        Long id,
        Long userId,
        int size,
        String storeName,
        LocalDateTime createdDate,
        LocalDateTime updatedDate,
        List<LocationResponseDto> locations,
        List<WallResponseDto> walls
        ) {
}
