package com.a302.wms.domain.product.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
public record ProductWithUserResponseDto(Long id,
        int quantity,
        String locationName,
        int floorLevel,
        LocalDateTime expirationDate,
        Long storeId,
        Long barcode,
        String name,
        int originalPrice,
        int sellingPrice) {

       @Builder

       public ProductWithUserResponseDto(Long id, int quantity, String locationName, int floorLevel,
                                         LocalDateTime expirationDate, Long storeId, Long barcode,
                                         String name, int originalPrice, int sellingPrice) {
              this.id = id;
              this.quantity = quantity;
              this.locationName = locationName;
              this.floorLevel = floorLevel;
              this.expirationDate = expirationDate;
              this.storeId = storeId;
              this.barcode = barcode;
              this.name = name;
              this.originalPrice = originalPrice;
              this.sellingPrice = sellingPrice;
       }
}
