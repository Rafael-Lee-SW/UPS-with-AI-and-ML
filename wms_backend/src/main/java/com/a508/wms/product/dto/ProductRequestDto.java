package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequestDto {

    private String name;
    private Long barcode;
    private int quantity;
    private LocalDateTime expirationDate;
    private ProductStorageTypeEnum productStorageType;
    private Long warehouseId;

}
