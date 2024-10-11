package com.a302.wms.domain.product.mapper;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.product.dto.ProductImportRequest;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.store.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    /**
     * Product -> ProductResponseDto
     *
     * @param product
     * @return
     */
    public static ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .barcode(product.getBarcode())
                .sku(product.getSku())
                .quantity(product.getQuantity())
                .floorLevel(product.getFloor().getFloorLevel())
                .locationName(product.getFloor().getLocation().getName())
                .originalPrice(product.getOriginalPrice())
                .sellingPrice(product.getSellingPrice())
                .storeId(product.getStore().getId())
                .build();
    }

    public static Product fromProductImportRequest(ProductImportRequest productImportRequest,
                                                   Floor floor,
                                                   Store store) {
        return Product.builder()
                .barcode(productImportRequest.barcode())
                .floor(floor)
                .originalPrice(productImportRequest.originalPrice())
                .productName(productImportRequest.productName())
                .quantity(productImportRequest.quantity())
                .sellingPrice(productImportRequest.sellingPrice())
                .sku(productImportRequest.sku())
                .store(store)
                .build();
    }

}
