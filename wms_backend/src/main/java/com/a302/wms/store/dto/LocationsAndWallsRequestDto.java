package com.a302.wms.store.dto;

import com.a302.wms.domain.location.dto.LocationUpdateDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class LocationsAndWallsRequestDto {

    private List<LocationUpdateDto> locations;
    private List<WallDto> walls;
}
