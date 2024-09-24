package com.a302.wms.domain.product.controller;


import com.a302.wms.domain.device.dto.DeviceRegisterRequestDto;
import com.a302.wms.domain.product.dto.ProductImportRequestDto;
import com.a302.wms.domain.product.dto.ProductMoveRequestDto;
import com.a302.wms.domain.product.dto.ProductResponseDto;
import com.a302.wms.domain.product.dto.ProductUpdateRequestDto;
import com.a302.wms.domain.product.dto.*;
import com.a302.wms.domain.product.exception.ProductException;
import com.a302.wms.domain.product.exception.ProductInvalidRequestException;
import com.a302.wms.domain.product.service.ProductFlowService;
import com.a302.wms.domain.product.service.ProductService;
import com.a302.wms.global.response.BaseSuccessResponse;
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
     * 등록된 Kiosk의 Kiosk key로 해당 매장의 모든 상품을 불러오는 메서드
     * @param dto
     * @return
     */
    @PostMapping
    public BaseSuccessResponse<List<ProductResponseDto>> getProductsByKioskKey(
            @RequestBody DeviceRegisterRequestDto dto
    ) {
        return new BaseSuccessResponse<>(productService.findAllByKioskKey(dto));
    }

    /**
     * (서비스 전체/매장 별/상품 정보별)로의 상품들을 반환하는 기능
     * 해당 매장의 모든 상품 호출
     * 해당 사업자의 모든 상품 호출
     * @param storeId     매장 id
     * @param userId      사업자 id
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<ProductResponseDto>> getProducts(
        @RequestParam(required = false) Long storeId,
        @RequestParam(required = false) Long userId) {
        if (storeId != null) {
            log.info("[Controller] find Products by storeId: {}", storeId);
            return new BaseSuccessResponse<>(productService.findAllByStoreId(storeId));
        } else if (userId != null) {
            log.info("[Controller] find Products by userId: {}", userId);
            return new BaseSuccessResponse<>(productService.findAllByUserId(userId));
        }  else {
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
     */
    @DeleteMapping
    public BaseSuccessResponse<Void> deleteProducts(@RequestParam List<Long> productIds) {
        log.info("[Controller] delete Products");

        productService.deleteProducts(productIds);

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
    /*@GetMapping("/notifications")
    public BaseSuccessResponse<?> findAllNotifications(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) Long storeId,
        @RequestParam ProductFlowTypeEnum productFlowTypeEnum) throws Exception {
        log.info("[Controller] find Notifications by userId: {}", userId);
        if (userId != null && storeId != null) {
            productFlowService.findAllByUserIdAndStoreId(userId, storeId);
        }
        if (storeId != null) {
            log.info("[Controller] find Notifications by storeId: {}", storeId);
            return new BaseSuccessResponse<>(productFlowService.findByStoreIdAndProductFlowTypeEnum(storeId,
                    productFlowTypeEnum));
        }
        if (userId != null) {
            log.info("[Controller] find Notifications by userId: {}", userId);
            return new BaseSuccessResponse<>(productFlowService.findAllByUserIdAndProductFlowTypeEnum(userId,
                    productFlowTypeEnum));
        }
        // TODO
        return null;
    }*/

    @PostMapping("/move")
    public BaseSuccessResponse<Void> moveProducts(
            @RequestBody List<ProductMoveRequestDto> requests) throws ProductException {

        log.info("[Controller] find ProductMoveRequestDtos: {}", requests);
        productService.moveProducts(requests);
        return new BaseSuccessResponse<>(null);
    }

}
