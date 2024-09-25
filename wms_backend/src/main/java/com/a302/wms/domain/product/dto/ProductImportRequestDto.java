package com.a302.wms.domain.product.dto;

import lombok.*;

import java.time.LocalDateTime;

public record ProductImportRequestDto(
        String productName,
        String sku,
        Long barcode,
        int quantity,
        LocalDateTime expirationDate,
        Long storeId) {

    @Builder

    public ProductImportRequestDto(String productName, String sku, Long barcode, int quantity, LocalDateTime expirationDate, Long storeId) {
        this.productName = productName;
        this.sku = sku;
        this.barcode = barcode;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
        this.storeId = storeId;
    }
}