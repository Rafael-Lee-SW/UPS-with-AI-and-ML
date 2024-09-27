package com.a302.wms.domain.store.dto.store;

import lombok.Builder;

import java.time.LocalDateTime;


@Builder
public record StoreCreateRequest(
        Long userId,
        Integer size,
        String storeName,
        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {
}
