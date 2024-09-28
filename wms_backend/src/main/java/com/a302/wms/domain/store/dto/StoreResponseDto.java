package com.a302.wms.domain.store.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record StoreResponseDto(
        Long id,
        Long userId,
        int size,
        String storeName,
        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {
}
