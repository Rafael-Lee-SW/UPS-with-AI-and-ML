package com.a302.wms.domain.product.dto;

import com.a302.wms.global.constant.ProductFlowTypeEnum;
import lombok.Builder;

import java.time.LocalDateTime;
@Builder
public record ProductFlowResponse(
    String productName,
    Long barcode,
    Integer quantity,
    String sku,
    String previousLocationName,
    Integer previousFloorLevel,
    String presentLocationName,
    Integer presentFloorLevel,
    LocalDateTime flowDate,
    ProductFlowTypeEnum productFlowTypeEnum,
    Long storeId,
    String storeName) {

}
