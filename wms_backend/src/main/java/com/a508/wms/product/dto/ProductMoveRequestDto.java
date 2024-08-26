package com.a508.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductMoveRequestDto {
    private Long productId;
    private String locationName;
    private Integer floorLevel;
    private Long warehouseId;
    private Integer quantity;
}
