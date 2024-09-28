package com.a302.wms.domain.store.dto;

import com.a302.wms.domain.structure.dto.location.LocationResponseDto;
import com.a302.wms.domain.structure.dto.wall.WallResponseDto;
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
