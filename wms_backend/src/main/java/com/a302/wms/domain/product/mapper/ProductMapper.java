package com.a302.wms.domain.product.mapper;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.product.dto.ProductImportRequest;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.dto.ProductWithUserResponse;
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
  public static ProductResponse toProductResponseDto(Product product) {

    return ProductResponse.builder()
        .productId(product.getProductId())
        .productName(product.getProductName())
        .barcode(product.getBarcode())
        .sku(product.getSku())
        .quantity(product.getQuantity())
        .locationName(product.getFloor().getLocation().getName())
        .floorLevel(product.getFloor().getFloorLevel())
        .storeId(product.getStore().getId())
        .originalPrice(product.getOriginalPrice())
        .sellingPrice(product.getSellingPrice())
        .build();
  }

  public static Product fromProductImportRequestDto(
          ProductImportRequest productImportRequest, Floor floor) {
    return Product.builder()
        .floor(floor)
        .sku(productImportRequest.sku())
        .quantity(productImportRequest.quantity())
        .build();
  }

  public static ProductWithUserResponse toProductWithUserDto(Product product) {
    return ProductWithUserResponse.builder().build();
  }
}
