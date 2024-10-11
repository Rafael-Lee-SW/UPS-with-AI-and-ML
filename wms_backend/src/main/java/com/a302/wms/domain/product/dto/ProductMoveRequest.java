package com.a302.wms.domain.product.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;

public record ProductMoveRequest(Long productId,
                                 Long locationId,
                                 Integer floorLevel,
                                 LocalDate movementDate) {

   @Builder
   public ProductMoveRequest(Long productId,
                             Long locationId,
                             Integer floorLevel,
                             LocalDate movementDate) {
      this.productId = productId;
      this.locationId = locationId;
      this.floorLevel = floorLevel;
      this.movementDate = movementDate;
   }
}
