package com.a508.wms.location.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class LocationStorageResponseDto {
    private Long id;
    private Integer floorStorage;
}
