package com.a508.wms.location.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class LocationSaveRequestDto {
    private Long warehouseId;
    private List<LocationRequestDto> requests;
}
