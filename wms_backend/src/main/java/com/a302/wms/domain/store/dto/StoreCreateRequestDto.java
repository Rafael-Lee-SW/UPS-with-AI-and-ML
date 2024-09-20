package com.a302.wms.domain.store.dto;

import lombok.Builder;

import java.time.LocalDateTime;


@Builder
public record StoreCreateRequestDto(
        Long userId,
        Integer size,
        String storeName,
        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {
}
