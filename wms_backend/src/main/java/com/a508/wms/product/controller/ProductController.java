package com.a508.wms.product.controller;


import com.a508.wms.floor.exception.FloorException;
import com.a508.wms.notification.dto.NotificationResponseDto;
import com.a508.wms.product.dto.*;
import com.a508.wms.product.exception.ProductException;
import com.a508.wms.product.exception.ProductInvalidRequestException;
import com.a508.wms.product.service.ProductFlowModuleService;
import com.a508.wms.product.service.ProductService;
import com.a508.wms.util.BaseSuccessResponse;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductFlowModuleService productFlowModuleService;

    /**
     * (서비스 전체/창고 별/상품 정보별)로의 상품들을 반환하는 기능
     *
     * @param warehouseId     창고 id
     * @param productDetailId 상품정보 id
     * @param locationId      로케이션 id
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<?>> getProducts(
        @RequestParam(required = false) Long warehouseId,
        @RequestParam(required = false) Long productDetailId,
        @RequestParam(required = false) Long locationId,
        @RequestParam(required = false) Long businessId) {
        if (warehouseId != null) {
            log.info("[Controller] find Products by warehouseId: {}", warehouseId);
            return new BaseSuccessResponse<>(productService.findByWarehouseId(warehouseId));
        } else if (productDetailId != null) {
            log.info("[Controller] find Products by productDetailId: {}", productDetailId);
            return new BaseSuccessResponse<>(productService.findAll());
        } else if (locationId != null) {
            log.info("[Controller] find Products by LocationId: {}", locationId);
            return new BaseSuccessResponse<>(productService.findByLocationId(locationId));
        } else if (businessId != null) {
            log.info("[Controller] find Products by businessId: {}", businessId);
            return new BaseSuccessResponse<>(productService.findAllByBusinessId(businessId));
        }else {
           throw new ProductInvalidRequestException("no Variable","null");
        }
    }

    /**
     * 특정 상품을 조회하는 기능
     *
     * @param id 상품 id
     * @return
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<ProductResponseDto> findById(@PathVariable Long id) {
        log.info("[Controller] find Product by id: {}", id);
        return new BaseSuccessResponse<>(productService.findById(id));
    }

    /**
     * 상품들을 수정하는 기능
     *
     * @param productUpdateRequestDtos 수정할 상품들의 정보
     */
    @PutMapping
    public BaseSuccessResponse<Void> updateProducts(@RequestBody List<ProductUpdateRequestDto> productUpdateRequestDtos) {
        log.info("[Controller] update Products");
        productService.updateAll(productUpdateRequestDtos);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 상품의 상태값 변경을 통해 삭제하는 기능.
     *
     * @param id: 상품의 id
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteProduct(@PathVariable Long id) {
        log.info("[Controller] delete Product by id: {}", id);
        productService.delete(id);

        return new BaseSuccessResponse<>(null);
    }

    /**
     * 물품들의 입고처리를 수행하는 기능
     *
     * @param requests 입고되는 상품의 정보(엑셀의 한 row)
     * @return
     */
    @PostMapping("/import")
    public BaseSuccessResponse<Void> importProducts(
        @RequestBody List<ProductRequestDto> requests
    ) {
        log.info("[Controller] create Imports ");
        productService.importProducts(requests);
        return new BaseSuccessResponse<>(null);
    }
    /**
     * 물품들의 출고 처리를 하는 로직
     *
     * @param exportProduct 출고되는 상품의 정보(엑셀의 한 row)
     * @return
     */

    @PostMapping("/export")
    public BaseSuccessResponse<List<ProductExportResponseDto>> exportProducts(
        @RequestBody ProductExportRequestDto exportProduct
    ) {
        log.info("[Controller] create Exports by ProductExportRequestDto: {}",
            exportProduct);
        return new BaseSuccessResponse<>(productService.exportProducts(exportProduct));
    }


    /**
     * 사업체에 대한 입,출고,유통기한 경고 상품 내역을 하나로 묶어서 반환하는 기능
     *
     * @param businessId 사업체의 id
     * @return
     */
    @GetMapping("/notification")
    public BaseSuccessResponse<NotificationResponseDto> findAllNotifications(
        @RequestParam Long businessId) {

        log.info("[Controller] find Notifications by businessId: {}", businessId);
        return new BaseSuccessResponse<>(NotificationResponseDto.builder()
                .productFlowResponseDtos(productFlowModuleService.findAllByBusinessId(businessId))
            .expirationProductResponseDtos(productService.findExpirationProducts(businessId))
            .build());

    }
    @PostMapping("/move")
    public BaseSuccessResponse<List<ProductMoveResponseDto>> moveProducts(
            @RequestBody List<ProductMoveRequestDto> requests) throws ProductException {

        log.info("[Controller] find ProductMoveRequestDtos: {}", requests);
        return new BaseSuccessResponse<>(productService.moveProducts(requests));
    }

    @GetMapping("/compress")
    public BaseSuccessResponse<Void> compressProducts(@RequestParam(value = "warehouseId") Long warehouseId,
                                                      @RequestParam(value = "businessId") Long businessId) throws ProductException, FloorException {
        log.info("[Controller] compress Products");
        productService.compress(warehouseId,businessId);
        return new BaseSuccessResponse<>(null);
    }
}
