package com.a302.wms.domain.product.mapper;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.location.entity.Location;
import com.a302.wms.domain.product.dto.ExpirationProductResponseDto;
import com.a302.wms.domain.product.dto.ProductImportRequestDto;
import com.a302.wms.domain.product.dto.ProductResponseDto;
import com.a302.wms.domain.product.dto.ProductWithUserResponseDto;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.product.dto.*;
import com.a302.wms.store.entity.Store;
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
                .quantity(product.getQuantity())
                .floorLevel(product.getFloor().getFloorLevel())
                .locationName(product.getFloor().getLocation().getName())
                .expirationDate(product.getExpirationDate() == null ? null : product.getExpirationDate())
                .build();
    }

    public static Product fromProductImportRequestDto(ProductImportRequestDto productImportRequestData,
                                                      Floor floor) {
        return Product.builder()
                .floor(floor)
                .quantity(productImportRequestData.quantity())
                .expirationDate(productImportRequestData.expirationDate())
                .build();
    }



    public static ExpirationProductResponseDto toExpirationProductResponseDto(Product product, boolean isExpired) {
        Floor floor = product.getFloor();
        Location location = floor.getLocation();
        Store store = location.getStore();


        return ExpirationProductResponseDto.builder()
                .barcode(product.getBarcode())
                .productName(product.getProductName())
                .expirationDate(product.getExpirationDate())
                .quantity(product.getQuantity())
                .locationName(location.getName())
                .floorLevel(floor.getFloorLevel())
                .isExpired(isExpired)
                .storeId(store.getId())
                .warehouseName(store.getName())
                .build();
    }

    public static ProductWithUserResponseDto toProductWithUserDto(Product product) {
        return ProductWithUserResponseDto.builder()
                .id(product.getProductId())
                .quantity(product.getQuantity())
                .locationName(product.getFloor().getLocation().getName())
                .floorLevel(product.getFloor().getFloorLevel())
                .expirationDate(product.getExpirationDate())
                .storeId(product.getFloor().getLocation().getStore().getId())
                .barcode(product.getBarcode())
                .name(product.getProductName())
                .originalPrice((product.getOriginalPrice() == null) ? 0
                        : product.getOriginalPrice())
                .sellingPrice((product.getSellingPrice() == null) ? 0
                        : product.getSellingPrice())
                .build();
    }

//    /**
//     * 상품이동 후 반환하는 Dto
//     *
//     * @param product
//     * @return
//     */
//    public static ProductMoveResponseDto toProductMoveResponseDto(Product product,
//                                                                  String productName,
//                                                                  Long barcode,
//                                                                  String sku,
//                                                                  int quantity,
//                                                                  LocalDateTime date,
//                                                                  String presentLocationName,
//                                                                  String presentFloorLevel,
//                                                                  String previousLocationName,
//                                                                  String previousFloorLevel) {
//        return ProductMoveResponseDto.builder()
//                .productName(product.getProductName())
//                .barcode(product.getBarcode())
//                .previousLocationName(previousLocationName)
//                .presentLocationName(presentLocationName)
//                .previousFloorLevel(previousFloorLevel)
//                .presentFloorLevel(presentFloorLevel)
//                .quantity(product.getQuantity())
//                .date(p)
//                .build();
//    }
}
