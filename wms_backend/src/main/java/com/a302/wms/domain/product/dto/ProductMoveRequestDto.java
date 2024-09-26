package com.a302.wms.domain.product.dto;

import java.time.LocalDateTime;
import lombok.Builder;

public record ProductMoveRequestDto(Long productId,
                                    Long locationId,
                                    Integer floorLevel,
                                    LocalDateTime movementDate) {

   @Builder
   public ProductMoveRequestDto(Long productId,
                                Long locationId,
                                Integer floorLevel,
                                LocalDateTime movementDate) {
      this.productId = productId;
      this.locationId = locationId;
      this.floorLevel = floorLevel;
      this.movementDate = movementDate;
   }
}
