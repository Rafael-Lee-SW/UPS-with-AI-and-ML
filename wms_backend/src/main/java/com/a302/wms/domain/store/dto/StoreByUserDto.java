package com.a302.wms.domain.store.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record StoreByUserDto(

        Long id,
        Long userId,
        int size,
        String name,
        int priority,
        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {


}
