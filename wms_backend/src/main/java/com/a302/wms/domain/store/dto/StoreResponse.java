package com.a302.wms.domain.store.dto;

import com.a302.wms.domain.device.dto.DeviceResponse;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record StoreResponse(
        Long id,
        Long userId,
        int size,
        String storeName,
        List<DeviceResponse> devices,
        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {
}
