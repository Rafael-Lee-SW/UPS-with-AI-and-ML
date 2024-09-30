package com.a302.wms.domain.product.dto;

import lombok.Builder;

public record ProductResponse(
    Long productId,
    String productName,
    Long barcode,
    String sku,
    Integer quantity,
    String locationName,
    Integer floorLevel,
    Long storeId,
    Integer originalPrice,
    Integer sellingPrice) {
  @Builder
  public ProductResponse(
      Long productId,
      String productName,
      Long barcode,
      String sku,
      Integer quantity,
      String locationName,
      Integer floorLevel,
      Long storeId,
      Integer originalPrice,
      Integer sellingPrice) {
    this.productId = productId;
    this.productName = productName;
    this.barcode = barcode;
    this.sku = sku;
    this.quantity = quantity;
    this.locationName = locationName;
    this.floorLevel = floorLevel;
    this.storeId = storeId;
    this.originalPrice = originalPrice;
    this.sellingPrice = sellingPrice;
  }
}
