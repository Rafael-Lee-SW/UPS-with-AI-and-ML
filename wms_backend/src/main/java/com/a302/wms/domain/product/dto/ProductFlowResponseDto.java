package com.a302.wms.domain.product.dto;

import com.a302.wms.global.constant.ProductFlowTypeEnum;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public record ProductFlowResponseDto(
    String productName,
    Long barcode,
    Integer quantity,
    String sku,
    String previousLocationName,
    Integer previousFloorLevel,
    String presentLocationName,
    Integer presentFloorLevel,
    LocalDateTime flowDate,
    ProductFlowTypeEnum productFlowTypeEnum) {

  @Builder
  public ProductFlowResponseDto(
      String productName,
      Long barcode,
      Integer quantity,
      String sku,
      String previousLocationName,
      Integer previousFloorLevel,
      String presentLocationName,
      Integer presentFloorLevel,
      LocalDateTime flowDate,
      ProductFlowTypeEnum productFlowTypeEnum) {
    this.productName = productName;
    this.barcode = barcode;
    this.quantity = quantity;
    this.sku = sku;
    this.previousLocationName = previousLocationName;
    this.previousFloorLevel = previousFloorLevel;
    this.presentLocationName = presentLocationName;
    this.presentFloorLevel = presentFloorLevel;
    this.flowDate = flowDate;
    this.productFlowTypeEnum = productFlowTypeEnum;
  }
}
