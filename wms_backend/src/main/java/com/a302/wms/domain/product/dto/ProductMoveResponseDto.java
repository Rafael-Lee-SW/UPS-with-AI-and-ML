package com.a302.wms.domain.product.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public record ProductMoveResponseDto(
        String productName,
        Long barcode,
        String sku,
        int quantity,
        LocalDateTime date,
        String presentLocationName,
        String presentFloorLevel,
        String previousLocationName,
        String previousFloorLevel
) {
  @Builder

   public ProductMoveResponseDto(String productName, Long barcode, String sku,
                                 int quantity, LocalDateTime date,
                                 String presentLocationName, String presentFloorLevel,
                                 String previousLocationName, String previousFloorLevel) {
      this.productName = productName;
      this.barcode = barcode;
      this.sku = sku;
      this.quantity = quantity;
      this.date = date;
      this.presentLocationName = presentLocationName;
      this.presentFloorLevel = presentFloorLevel;
      this.previousLocationName = previousLocationName;
      this.previousFloorLevel = previousFloorLevel;
   }
}
