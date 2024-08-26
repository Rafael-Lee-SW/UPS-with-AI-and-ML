package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class ExpirationProductResponseDto {
    private Long barcode;
    private String productName;
    private LocalDateTime expirationDate;
    private ProductStorageTypeEnum productStorageType;
    private int quantity;
    private String locationName;
    private int floorLevel;
    private boolean isExpired;
    private Long warehouseId;
    private String warehouseName;
}
