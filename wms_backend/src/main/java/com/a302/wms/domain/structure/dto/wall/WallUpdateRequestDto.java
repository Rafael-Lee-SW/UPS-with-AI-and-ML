package com.a302.wms.domain.structure.dto.wall;

public record WallUpdateRequestDto(
        Long id,
        int startX,
        int startY,
        int endX,
        int endY) {
}
