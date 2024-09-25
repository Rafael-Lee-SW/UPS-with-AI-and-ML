package com.a302.wms.domain.location.dto;

import com.a302.wms.domain.floor.dto.FloorResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class LocationResponseDto {

    private Long id;
    private int xPosition;
    private int yPosition;
    private int xSize;
    private int ySize;
    private int zSize;
    private int fill; //0~100까지의 범위로 표현,
    private String name;
    private int rotation;
    private List<FloorResponse> floorResponses;
}