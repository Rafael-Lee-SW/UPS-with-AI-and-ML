package com.a302.wms.domain.floor.dto;


import lombok.Builder;

import java.time.LocalDateTime;

public record FloorResponseDto(Long id,
                               Long locationId,
                               int floorLevel,
                               LocalDateTime createdDate,
                               LocalDateTime updatedDate) {

    @Builder

    public FloorResponseDto(Long id,
                            Long locationId,
                            int floorLevel,
                            LocalDateTime createdDate,
                            LocalDateTime updatedDate) {
        this.id = id;
        this.locationId = locationId;
        this.floorLevel = floorLevel;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}
