package com.a302.wms.domain.product.mapper;

import com.a302.wms.domain.product.dto.ProductImportRequest;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.dto.ProductWithUserResponse;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.structures.dto.location.Floor;
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
                .floorLevel(product.getFloor().getFloorLevel())
                .locationName(product.getFloor().getLocation().getName())
                .build();
    }

    public static Product fromProductImportRequestDto(ProductImportRequest productImportRequestDto,
                                                      Floor floor) {
        return Product.builder()
                .barcode(productImportRequestDto.barcode())
                .floor(floor)
                .sku(productImportRequestDto.sku())
                .quantity(productImportRequestDto.quantity())
                .build();
    }

    public static ProductWithUserResponse toProductWithUserDto(Product product) {
        return ProductWithUserResponse.builder()
                .build();
    }


}
