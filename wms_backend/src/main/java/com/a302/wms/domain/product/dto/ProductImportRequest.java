package com.a302.wms.domain.product.dto;

import lombok.*;

@Builder
public record ProductImportRequest(
        Long barcode,
        Integer originalPrice,
        String productName,
        Integer quantity,
        Integer sellingPrice,
        String sku,
        Long storeId) {
}
