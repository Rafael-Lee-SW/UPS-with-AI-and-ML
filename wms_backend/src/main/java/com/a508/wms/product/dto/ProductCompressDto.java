package com.a508.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class ProductCompressDto {
    private Long id;
    private Long floorId;
    private Long productDetailId;
    private Long locationId;
    private Long warehouseId;
    private int quantity;
    private String locationName;

}
