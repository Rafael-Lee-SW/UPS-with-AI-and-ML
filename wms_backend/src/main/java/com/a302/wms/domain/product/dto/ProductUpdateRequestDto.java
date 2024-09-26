package com.a302.wms.domain.product.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public record ProductUpdateRequestDto(
        Long productId,
        Long barcode,
        String sku,
        String productName,
        Integer quantity,
        
        Integer originalPrice,
        Integer sellingPrice
        ) {

    @Builder
    public ProductUpdateRequestDto(Long productId, Long barcode, String sku,
                                   String productName, Integer quantity,
                                   
                                   Integer originalPrice, Integer sellingPrice) {
        this.productId = productId;
        this.barcode = barcode;
        this.sku = sku;
        this.productName = productName;
        this.quantity = quantity;
        
        this.originalPrice = originalPrice;
        this.sellingPrice = sellingPrice;
    }
}
