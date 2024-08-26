package com.a508.wms.product.dto;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
public class ProductUpdateRequestDto {
    private Long productId;
    private Integer floorLevel;
    private String locationName;
    private ProductRequestDto productRequestDto;

}
