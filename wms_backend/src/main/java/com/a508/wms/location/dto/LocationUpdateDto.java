package com.a508.wms.location.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class LocationUpdateDto {

    private Long id;
    private String name;
    private int xPosition;
    private int yPosition;
    private int xSize;
    private int ySize;
    private int zSize;
    private ProductStorageTypeEnum storageType;
    private int rotation;

}
