package com.a302.wms.domain.location.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class LocationRequestDto {

    private String name;
    @Builder.Default
    private int xPosition = -1;
    @Builder.Default
    private int yPosition = -1;
    @Builder.Default
    private int xSize = -1;
    @Builder.Default
    private int ySize = -1;
    @Builder.Default
    private int zSize = -1;
    @Builder.Default
    private int rotation = 0;

    private Integer touchableFloor;

}
