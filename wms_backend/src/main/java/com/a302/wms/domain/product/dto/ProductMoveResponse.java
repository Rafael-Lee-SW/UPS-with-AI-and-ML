package com.a302.wms.domain.product.dto;

import java.time.LocalDateTime;
import lombok.Builder;

public record ProductMoveResponse(
    String productName,
    Long barcode,
    String sku,
    int quantity,
    LocalDateTime date,
    String presentLocationName,
    String presentFloorLevel,
    String previousLocationName,
    String previousFloorLevel) {
  @Builder
  public ProductMoveResponse(
      String productName,
      Long barcode,
      String sku,
      int quantity,
      LocalDateTime date,
      String presentLocationName,
      String presentFloorLevel,
      String previousLocationName,
      String previousFloorLevel) {
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
