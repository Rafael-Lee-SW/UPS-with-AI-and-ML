package com.a302.wms.domain.product.controller;

import com.a302.wms.domain.product.service.ProductFlowServiceImpl;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.response.BaseExceptionResponse;
import com.a302.wms.global.response.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/product-flows")
@RequiredArgsConstructor
public class ProductFlowController {
    private final ProductFlowServiceImpl productFlowServiceImpl;

    @GetMapping("/batch")
    public ResponseEntity<?> getAllProductFlows(
            @RequestParam(name = "userId", required = false) Long userId,
            @RequestParam(name = "storeId", required = false) Long storeId,
            @RequestParam(name = "notificationId", required = false) Long notificationId) {
        if (storeId != null) {
            return ResponseEntity.ok(new BaseSuccessResponse<>(productFlowServiceImpl.findAllByStoreId(storeId)));
        } else if (userId != null) {
            return ResponseEntity.ok(new BaseSuccessResponse<>(productFlowServiceImpl.findAllByUserId(userId)));
        } else if (notificationId != null) {
            return ResponseEntity.ok(new BaseSuccessResponse<>(productFlowServiceImpl.findAllByNotificationId(notificationId)));

        } else
            return ResponseEntity.badRequest().body(new BaseExceptionResponse(false, ResponseEnum.SERVER_ERROR.getStatusCode(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    ResponseEnum.SERVER_ERROR.getMessage()));
    }

    @GetMapping
    public ResponseEntity<?> getAllProductFlowsProductIdAndType(
            @RequestParam(name = "productId", required = false) Long productId,
            @RequestParam(name = "productFlowType", required = false) String type) {
        if (productId != null) {
            if (type != null) {
            return ResponseEntity.ok(new BaseSuccessResponse<>(productFlowServiceImpl.findAllByProductIdAndType(productId, type)));
            }
                return ResponseEntity.ok(new BaseSuccessResponse<>(productFlowServiceImpl.findAllByProductId(productId)));
        }
         else
            return ResponseEntity.badRequest().body(new BaseExceptionResponse(false, ResponseEnum.SERVER_ERROR.getStatusCode(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    ResponseEnum.SERVER_ERROR.getMessage()));
    }}

