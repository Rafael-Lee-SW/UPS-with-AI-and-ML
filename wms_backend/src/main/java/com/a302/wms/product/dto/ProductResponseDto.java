package com.a302.wms.product.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public record ProductResponseDto(Long productId,
                                 String productName,
                                 Long barcode,
                                 Integer quantity,
                                 String locationName,
                                 Integer floorLevel,
                                 LocalDateTime expirationDate,
                                 Long storeId,
                                 Integer originalPrice,
                                 Integer sellingPrice) {
    @Builder
    public ProductResponseDto(Long productId, String productName, Long barcode,
                              Integer quantity, String locationName,
                              Integer floorLevel, LocalDateTime expirationDate,
                              Long storeId, Integer originalPrice, Integer sellingPrice) {
        this.productId = productId;
        this.productName = productName;
        this.barcode = barcode;
        this.quantity = quantity;
        this.locationName = locationName;
        this.floorLevel = floorLevel;
        this.expirationDate = expirationDate;
        this.storeId = storeId;
        this.originalPrice = originalPrice;
        this.sellingPrice = sellingPrice;
    }

}
