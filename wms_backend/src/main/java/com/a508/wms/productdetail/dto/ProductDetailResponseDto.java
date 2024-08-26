package com.a508.wms.productdetail.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Builder
@Setter
@ToString
public class ProductDetailResponseDto {

    private Long id;
    private Long businessId;
    private ProductStorageTypeEnum productStorageType;
    private Long barcode;
    private String name;
    private int size;
    private int unit;
    private int originalPrice;
    private int sellingPrice;
}
