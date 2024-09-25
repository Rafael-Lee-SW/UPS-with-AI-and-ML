package com.a302.wms.domain.location.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class LocationSaveRequestDto {
    private Long storeId;
    private List<LocationRequestDto> requests;
}
