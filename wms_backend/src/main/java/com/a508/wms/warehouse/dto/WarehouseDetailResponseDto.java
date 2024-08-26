package com.a508.wms.warehouse.dto;

import com.a508.wms.location.dto.LocationResponseDto;
import com.a508.wms.util.constant.FacilityTypeEnum;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class WarehouseDetailResponseDto {

    private Long id;
    private int size;
    private String name;
    private int rowCount;
    private int columnCount;
    private int priority;
    private FacilityTypeEnum facilityTypeEnum;
    private List<LocationResponseDto> locations;
    private List<WallDto> walls;
}
