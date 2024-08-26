package com.a508.wms.warehouse.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class WallRequestDto {
    private Long warehouseId;
    List<WallDto> wallDtos;
}
