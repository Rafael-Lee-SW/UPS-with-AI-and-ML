package com.a302.wms.domain.location.dto;

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
