package com.a302.wms.product.controller;


import com.a302.wms.product.dto.*;
import com.a302.wms.product.exception.ProductException;
import com.a302.wms.product.exception.ProductInvalidRequestException;
import com.a302.wms.product.service.ProductFlowService;
import com.a302.wms.product.service.ProductService;
import com.a302.wms.util.BaseSuccessResponse;
import com.a302.wms.util.constant.ProductFlowType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductFlowService productFlowService;

    /**
     * (서비스 전체/매장 별/상품 정보별)로의 상품들을 반환하는 기능
     *
     * @param storeId     매장 productId
     * @param productDetailId 상품정보 productId
     * @param locationId      로케이션 productId
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<?>> getProducts(
        @RequestParam(required = false) Long storeId,
        @RequestParam(required = false) Long productDetailId,
        @RequestParam(required = false) Long locationId) {
        if (storeId != null) {
            log.info("[Controller] find Products by storeId: {}", storeId);
            return new BaseSuccessResponse<>(productService.findByStoreId(storeId));
        } else if (productDetailId != null) {
            log.info("[Controller] find Products by productDetailId: {}", productDetailId);
            return new BaseSuccessResponse<>(productService.findAll());
        } else if (locationId != null) {
            log.info("[Controller] find Products by LocationId: {}", locationId);
            return new BaseSuccessResponse<>(productService.findByLocationId(locationId));
        } else {
           throw new ProductInvalidRequestException("no Variable","null");
        }
    }

    /**
     * 특정 상품을 조회하는 기능
     *
     * @param id 상품 productId
     * @return
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<ProductResponseDto> findById(@PathVariable Long id) {
        log.info("[Controller] find Product by productId: {}", id);
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
     * 상품 삭제
     *
     * @param id: 상품의 productId
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteProduct(@PathVariable Long id) {
        log.info("[Controller] delete Product by productId: {}", id);
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
        @RequestBody List<ProductImportRequestDto> requests
    ) {
        log.info("[Controller] create Imports ");
        productService.importProducts(requests);
        return new BaseSuccessResponse<>(null);
    }


    /**
     * 사업체에 대한 입,출고,유통기한 경고 상품 내역을 하나로 묶어서 반환하는 기능
     *
     * @param userId 사업체의 productId
     * @return
     */
    @GetMapping("/notifications")
    public BaseSuccessResponse<?> findAllNotifications(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) Long storeId,
        @RequestParam ProductFlowType productFlowType) throws Exception {
        log.info("[Controller] find Notifications by userId: {}", userId);
        if (userId != null && storeId != null) {
            productFlowService.findByUserIdAndStoreId(userId, storeId);
        }
        if (storeId != null) {
            log.info("[Controller] find Notifications by storeId: {}", storeId);
            return new BaseSuccessResponse<>(productFlowService.findByStoreIdAndProductFlowType(storeId,
                    productFlowType));
        }
        if (userId != null) {
            log.info("[Controller] find Notifications by userId: {}", userId);
            return new BaseSuccessResponse<>(productFlowService.findByUserIdAndProductFlowType(userId,
                    productFlowType));
        }
        // TODO
        return null;
    }

    @PostMapping("/move")
    public BaseSuccessResponse<Void> moveProducts(
            @RequestBody List<ProductMoveRequestDto> requests) throws ProductException {

        log.info("[Controller] find ProductMoveRequestDtos: {}", requests);
        productService.moveProducts(requests);
        return new BaseSuccessResponse<>(null);
    }

}
