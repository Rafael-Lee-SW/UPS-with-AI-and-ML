package com.a302.wms.store.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class WallDto {

    private Long id;
    private int startX;
    private int startY;
    private int endX;
    private int endY;
}
