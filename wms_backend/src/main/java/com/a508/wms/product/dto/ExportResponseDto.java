package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
public class ExportResponseDto {

    private String trackingNumber;
    private Long barcode;
    private String locationName;
    private String productName;
    private int quantity;
    private int floorLevel;
    private LocalDateTime date;
    private LocalDateTime expirationDate;
    private ProductStorageTypeEnum productStorageType;

    private String warehouseName;
    private Long warehouseId;
}
