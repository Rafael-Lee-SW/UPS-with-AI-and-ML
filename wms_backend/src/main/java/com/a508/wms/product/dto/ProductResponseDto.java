package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.*;

import java.time.LocalDateTime;
@Builder
@Data
public class ProductResponseDto {

    private Long id;
    private String name;
    private Long barcode;
    private Integer quantity;
    private String locationName;
    private Integer floorLevel;
    private LocalDateTime expirationDate;
    private Long warehouseId;
    private ProductStorageTypeEnum storageType;
    private Integer size;
    private Integer unit;
    private Integer originalPrice;
    private Integer sellingPrice;
}
