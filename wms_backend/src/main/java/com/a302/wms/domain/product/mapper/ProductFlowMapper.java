package com.a302.wms.domain.product.mapper;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.product.dto.ProductFlowResponse;
import com.a302.wms.domain.product.entity.ProductFlow;
import org.springframework.stereotype.Component;

@Component
public class ProductFlowMapper {
    public static ProductFlowResponse toProductFlowResponse(ProductFlow productFlow,
                                                            Floor previousFloor,
                                                            Floor presentFloor) {
        return ProductFlowResponse.builder()
                .presentFloorLevel(presentFloor.getFloorLevel())
                .previousFloorLevel(previousFloor.getFloorLevel())
                .flowDate(productFlow.getFlowDate())
                .barcode(productFlow.getBarcode())
                .productFlowTypeEnum(productFlow.getProductFlowTypeEnum())
                .productName(productFlow.getProductName())
                .sku(productFlow.getSku())
                .quantity(productFlow.getQuantity())
                .build();
    }
}
