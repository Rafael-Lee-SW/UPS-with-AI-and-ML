package com.a302.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

public record ExpirationProductResponseDto(
       Long barcode,
       String productName,
       LocalDateTime expirationDate,
       int quantity,
       String locationName,
       int floorLevel,
       boolean isExpired,
       Long storeId,
       String warehouseName) {
    @Builder
    public ExpirationProductResponseDto(Long barcode, String productName, LocalDateTime expirationDate,
                                        int quantity, String locationName, int floorLevel, boolean isExpired,
                                        Long storeId, String warehouseName) {
        this.barcode = barcode;
        this.productName = productName;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
        this.locationName = locationName;
        this.floorLevel = floorLevel;
        this.isExpired = isExpired;
        this.storeId = storeId;
        this.warehouseName = warehouseName;
    }
}
