package com.a302.wms.floor.dto;

import lombok.*;

public record FloorRequestDto (
        int floorLevel
) {
    @Builder
    public FloorRequestDto (int floorLevel) {
        this.floorLevel = floorLevel;
    }
}
