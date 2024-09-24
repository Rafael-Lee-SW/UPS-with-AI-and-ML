package com.a302.wms.domain.store.dto.wall;

public record WallUpdateRequestDto(
        Long id,
        int startX,
        int startY,
        int endX,
        int endY) {
}
