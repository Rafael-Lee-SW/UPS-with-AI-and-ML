package com.a302.wms.domain.product.mapper;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.product.dto.ProductFlowResponse;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.entity.ProductFlow;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ProductFlowMapper {
    public static ProductFlow fromProduct(Product product,
                                          LocalDateTime flowDate,
                                          Floor previousFloor,
                                          ProductFlowTypeEnum productFlowTypeEnum) {
        return ProductFlow.builder()
                .barcode(product.getBarcode())
                .flowDate(flowDate)
                .presentFloorId(product.getFloor().getFloorId())
                .previousFloorId(previousFloor.getFloorId())
                .productFlowTypeEnum(productFlowTypeEnum)
                .productName(product.getProductName())
                .quantity(product.getQuantity())
                .sku(product.getSku())
                .userId(product.getStore().getUser().getId())
                .storeId(product.getStore().getId())
                .build();
    }

    public static ProductFlowResponse toProductFlowResponseDto(ProductFlow productFlow,
                                                               Floor presentFloor,
                                                               Floor previousFloor,
                                                               Store store) {

    return ProductFlowResponse.builder()
        .barcode(productFlow.getBarcode())
        .flowDate(productFlow.getFlowDate())
        .presentFloorLevel(presentFloor.getFloorLevel())
        .presentLocationName(presentFloor.getLocation().getName())
        .previousFloorLevel(previousFloor.getFloorLevel())
        .previousLocationName(previousFloor.getLocation().getName())
        .productFlowTypeEnum(productFlow.getProductFlowTypeEnum())
        .productName(productFlow.getProductName())
        .quantity(productFlow.getQuantity())
        .sku(productFlow.getSku())
        .storeId(store.getId())
        .storeName(store.getStoreName())
        .build();
    }
}
