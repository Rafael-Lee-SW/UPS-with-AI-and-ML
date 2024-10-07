package com.a302.wms.domain.product.controller;

import com.a302.wms.domain.product.dto.ProductFlowResponse;
import com.a302.wms.domain.product.service.ProductFlowServiceImpl;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.response.BaseExceptionResponse;
import com.a302.wms.global.response.BaseSuccessResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/product-flows")
@RequiredArgsConstructor
public class ProductFlowController {
  private final ProductFlowServiceImpl productFlowServiceImpl;

  @GetMapping
  public ResponseEntity<?> getAllProductFlows(
      @RequestParam(name = "userId", required = false) Long userId,
      @RequestParam(name = "storeId", required = false) Long storeId) {
    if (storeId != null) {
      return ResponseEntity.ok(new BaseSuccessResponse<>(productFlowServiceImpl.findAllByStoreId(storeId)));
    }
    else if(userId != null) {
    return ResponseEntity.ok(new BaseSuccessResponse<>(productFlowServiceImpl.findAllByUserId(userId)));
    } else return ResponseEntity.badRequest().body(new BaseExceptionResponse(false,ResponseEnum.SERVER_ERROR.getStatusCode(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            ResponseEnum.SERVER_ERROR.getMessage()));
  }
}
