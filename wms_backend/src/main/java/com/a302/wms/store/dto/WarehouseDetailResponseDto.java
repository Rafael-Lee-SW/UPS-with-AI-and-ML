package com.a302.wms.store.dto;

import com.a302.wms.location.dto.LocationResponseDto;
import com.a302.wms.util.constant.FacilityTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class StoreDetailResponseDto {

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
