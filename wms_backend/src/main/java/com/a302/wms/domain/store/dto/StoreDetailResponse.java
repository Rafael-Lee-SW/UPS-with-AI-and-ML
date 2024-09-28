package com.a302.wms.domain.store.dto;

import com.a302.wms.domain.structure.dto.location.LocationResponse;
import com.a302.wms.domain.structure.dto.wall.WallResponse;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record StoreDetailResponse(
        Long id,
        Long userId,
        int size,
        String storeName,
        LocalDateTime createdDate,
        LocalDateTime updatedDate,
        List<LocationResponse> locations,
        List<WallResponse> walls
        ) {
}
