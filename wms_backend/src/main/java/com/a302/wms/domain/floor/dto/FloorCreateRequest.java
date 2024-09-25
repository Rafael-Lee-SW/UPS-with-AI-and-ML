package com.a302.wms.domain.floor.dto;

import lombok.*;

public record FloorCreateRequest(
        int floorLevel
) {
    @Builder
    public FloorCreateRequest(int floorLevel) {
        this.floorLevel = floorLevel;
    }
}
