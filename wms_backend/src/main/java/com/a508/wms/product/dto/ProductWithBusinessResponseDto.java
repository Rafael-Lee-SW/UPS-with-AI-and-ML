package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Builder
@Getter
@Setter
public class ProductWithBusinessResponseDto {

        private Long id;
        private int quantity;
        private String locationName;
        private int floorLevel;
        private LocalDateTime expirationDate;
        private Long warehouseId;
        private ProductStorageTypeEnum productStorageType;
        private Long barcode;
        private String name;
        private int size;
        private int unit;
        private int originalPrice;
        private int sellingPrice;

}
