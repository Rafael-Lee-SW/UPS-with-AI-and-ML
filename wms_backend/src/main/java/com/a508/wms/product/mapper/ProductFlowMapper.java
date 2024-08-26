package com.a508.wms.product.mapper;

import com.a508.wms.business.domain.Business;
import com.a508.wms.product.domain.ProductFlow;
import com.a508.wms.product.dto.*;
import com.a508.wms.util.constant.ProductFlowTypeEnum;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

import static com.a508.wms.util.constant.ProductConstant.*;

@Component
public class ProductFlowMapper {
    public static ProductFlowResponseDto toProductFlowResponseDto(ProductFlow productFlow) {
        return ProductFlowResponseDto.builder()
                .name(productFlow.getProductName())
                .barcode(productFlow.getBarcode())
                .quantity(productFlow.getQuantity())
                .trackingNumber(productFlow.getTrackingNumber() == null ? DEFAULT_TRACKING_NUMBER : productFlow.getTrackingNumber())
                .previousLocationName(productFlow.getPreviousLocationName())
                .currentLocationName(productFlow.getCurrentLocationName())
                .previousFloorLevel(productFlow.getPreviousFloorLevel())
                .currentFloorLevel(productFlow.getCurrentFloorLevel())
                .expirationDate(productFlow.getExpirationDate())
                .productStorageType(productFlow.getProductStorageType())
                .warehouseName(productFlow.getWarehouseName())
                .warehouseId(productFlow.getWarehouseId())
                .date(productFlow.getDate())
                .productFlowType(productFlow.getProductFlowType())
                .build();
    }
     public static ProductFlow fromExportProductResponseDto(ExportResponseDto exportResponseDto, Business business) {
         return ProductFlow.builder()
                 .business(business)
                 .warehouseId(exportResponseDto.getWarehouseId())
                 .trackingNumber(exportResponseDto.getTrackingNumber())
                 .barcode(exportResponseDto.getBarcode())
                 .currentLocationName(exportResponseDto.getLocationName())
                 .currentFloorLevel(exportResponseDto.getFloorLevel())
                 .productName(exportResponseDto.getProductName())
                 .quantity(exportResponseDto.getQuantity())
                 .trackingNumber(exportResponseDto.getTrackingNumber())
                 .expirationDate(exportResponseDto.getExpirationDate())
                 .date(exportResponseDto.getDate())
                 .productStorageType(exportResponseDto.getProductStorageType())
                 .warehouseName(exportResponseDto.getWarehouseName())
                 .productFlowType(ProductFlowTypeEnum.EXPORT)
                 .build();
     }
     public static ProductFlow fromImportResponseDto(ProductRequestDto request,
                                                     Business business,
                                                     String warehouseName) {
         return ProductFlow.builder()
                 .business(business)
                 .warehouseId(request.getWarehouseId())
                 .barcode(request.getBarcode())
                 .currentLocationName(DEFAULT_LOCATION_NAME)
                 .currentFloorLevel(DEFAULT_FLOOR_LEVEL)
                 .productName(request.getName())
                 .quantity(request.getQuantity())
                 .trackingNumber(DEFAULT_TRACKING_NUMBER)
                 .expirationDate(request.getExpirationDate())
                 .date(LocalDateTime.now().withNano(0))
                 .productStorageType(request.getProductStorageType())
                 .warehouseName(warehouseName)
                 .productFlowType(ProductFlowTypeEnum.IMPORT)
                 .build();
     }

public static ProductFlow fromProductMoveResponseDto(ProductMoveResponseDto productMoveResponseDto,
                                                     Business business) {
    return ProductFlow.builder()
            .business(business)
            .warehouseId(productMoveResponseDto.getWarehouseId())
            .barcode(productMoveResponseDto.getBarcode())
            .previousLocationName(productMoveResponseDto.getPreviousLocationName())
            .previousFloorLevel(productMoveResponseDto.getPreviousFloorLevel())
            .currentLocationName(productMoveResponseDto.getCurrentLocationName())
            .currentFloorLevel(productMoveResponseDto.getCurrentFloorLevel())
            .productName(productMoveResponseDto.getName())
            .quantity(productMoveResponseDto.getQuantity())
            .trackingNumber(DEFAULT_TRACKING_NUMBER)
            .expirationDate(productMoveResponseDto.getExpirationDate())
            .date(productMoveResponseDto.getDate())
            .productStorageType(productMoveResponseDto.getProductStorageType())
            .warehouseName(productMoveResponseDto.getWarehouseName())
            .productFlowType(ProductFlowTypeEnum.FLOW)
            .build();
}
}