package com.a508.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@Getter
@Setter
@ToString
public class ProductCompressSortDto {
    private Integer floorLevel;
    private String locationName;
    private Long floorId;
    private Long locationId;
}
