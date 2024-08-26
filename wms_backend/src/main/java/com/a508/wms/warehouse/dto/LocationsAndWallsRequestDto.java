package com.a508.wms.warehouse.dto;

import com.a508.wms.location.dto.LocationRequestDto;
import com.a508.wms.location.dto.LocationUpdateDto;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class LocationsAndWallsRequestDto {

    private List<LocationUpdateDto> locations;
    private List<WallDto> walls;
}
