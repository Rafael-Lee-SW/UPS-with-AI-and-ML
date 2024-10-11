package com.a302.wms.domain.structure.dto.location;

import com.a302.wms.domain.floor.dto.FloorResponse;
import com.a302.wms.global.constant.LocationTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class LocationResponse {

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
    private LocationTypeEnum locationTypeEnum;
}
