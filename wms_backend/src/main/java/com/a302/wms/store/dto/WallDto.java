package com.a302.wms.store.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


public record WallDto (
        Long id,
        Integer startX,
        Integer startY,
        Integer endX,
        Integer endY
) {
  @Builder

    public WallDto(Long id, Integer startX, Integer startY, Integer endX, Integer endY) {
        this.id = id;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
}
