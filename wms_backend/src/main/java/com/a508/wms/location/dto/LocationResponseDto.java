package com.a508.wms.location.dto;

import com.a508.wms.floor.dto.FloorResponseDto;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
    private ProductStorageTypeEnum storageType;
    private int rotation;
    private List<FloorResponseDto> floorResponses;
}
