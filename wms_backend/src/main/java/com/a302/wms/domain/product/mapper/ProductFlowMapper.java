package com.a302.wms.domain.product.mapper;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.product.dto.ProductFlowResponseDto;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.entity.ProductFlow;
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
        .presentFloorId(product.getFloor().getId())
        .previousFloorId(previousFloor.getId())
        .productFlowTypeEnum(productFlowTypeEnum)
        .productName(product.getProductName())
        .quantity(product.getQuantity())
        .sku(product.getSku())
        .userId(product.getStore().getUser().getId())
        .build();
    }
    public static ProductFlowResponseDto toProductFlowResponseDto(ProductFlow productFlow,
                                                                  Floor presentFloor,
                                                                  Floor previousFloor) {

        return ProductFlowResponseDto.builder()
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
                .build();
    }
}
