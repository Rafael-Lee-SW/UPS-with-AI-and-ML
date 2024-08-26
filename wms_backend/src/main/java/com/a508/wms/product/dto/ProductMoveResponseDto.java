package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductFlowTypeEnum;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ProductMoveResponseDto {
    private String name;
    private Long barcode;
    private Integer quantity;
    private String previousLocationName;
    private String currentLocationName;
    private Integer previousFloorLevel;
    private Integer currentFloorLevel;
    private LocalDateTime expirationDate;
    private ProductStorageTypeEnum productStorageType;
    private String warehouseName;
    private Long warehouseId;
    private LocalDateTime date;
    private ProductFlowTypeEnum productFlowType;

}
