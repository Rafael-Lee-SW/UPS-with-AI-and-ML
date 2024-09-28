package com.a302.wms.domain.structure.dto.wall;

import lombok.Builder;

@Builder
public record WallCreateRequestDto(
        int startX,
        int startY,
        int endX,
        int endY
) {
}
