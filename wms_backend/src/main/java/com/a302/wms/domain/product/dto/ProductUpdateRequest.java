package com.a302.wms.domain.product.dto;

import lombok.Builder;

public record ProductUpdateRequest(
    Long productId,
    Long barcode,
    String sku,
    String productName,
    Integer quantity,
    Integer originalPrice,
    Integer sellingPrice) {

  @Builder
  public ProductUpdateRequest(
      Long productId,
      Long barcode,
      String sku,
      String productName,
      Integer quantity,
      Integer originalPrice,
      Integer sellingPrice) {
    this.productId = productId;
    this.barcode = barcode;
    this.sku = sku;
    this.productName = productName;
    this.quantity = quantity;
    this.originalPrice = originalPrice;
    this.sellingPrice = sellingPrice;
  }

  @Override
  public String toString() {
    return "ProductUpdateRequest{" +
            "barcode=" + barcode +
            ", productId=" + productId +
            ", sku='" + sku + '\'' +
            ", productName='" + productName + '\'' +
            ", quantity=" + quantity +
            ", originalPrice=" + originalPrice +
            ", sellingPrice=" + sellingPrice +
            '}';
  }
}
