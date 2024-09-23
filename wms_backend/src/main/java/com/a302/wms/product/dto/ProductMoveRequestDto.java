package com.a302.wms.product.dto;

import lombok.Builder;

import java.time.LocalDateTime;

public record ProductMoveRequestDto(Long productId,
                                    Long locationId,
                                    Integer floorLevel,
                                    LocalDateTime movementDate) {

   @Builder
   public ProductMoveRequestDto(Long productId, Long locationId, Integer floorLevel, LocalDateTime movementDate) {
      this.productId = productId;
      this.locationId = locationId;
      this.floorLevel = floorLevel;
      this.movementDate = movementDate;
   }
}
