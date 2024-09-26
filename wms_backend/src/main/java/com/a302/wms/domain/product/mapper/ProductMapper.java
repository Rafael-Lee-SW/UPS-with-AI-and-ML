package com.a302.wms.domain.product.mapper;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.product.dto.ProductImportRequestDto;
import com.a302.wms.domain.product.dto.ProductResponseDto;
import com.a302.wms.domain.product.dto.ProductWithUserResponseDto;
import com.a302.wms.domain.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

  /**
   * Product -> ProductResponseDto
   *
   * @param product
   * @return
   */
  public static ProductResponseDto toProductResponseDto(Product product) {
    return ProductResponseDto.builder()
        .productId(product.getProductId())
        .productName(product.getProductName())
        .barcode(product.getBarcode())
        .sku(product.getSku())
        .quantity(product.getQuantity())
        .floorLevel(product.getFloor().getFloorLevel())
        .locationName(product.getFloor().getLocation().getName())
        .build();
  }

  public static Product fromProductImportRequestDto(
      ProductImportRequestDto productImportRequestDto, Floor floor) {
    return Product.builder()
        .floor(floor)
        .sku(productImportRequestDto.sku())
        .quantity(productImportRequestDto.quantity())
        .build();
  }

  public static ProductWithUserResponseDto toProductWithUserDto(Product product) {
    return ProductWithUserResponseDto.builder().build();
  }
}
