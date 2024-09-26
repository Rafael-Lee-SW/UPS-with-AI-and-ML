package com.a302.wms.domain.product.controller;

import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.product.dto.ProductFlowResponse;
import com.a302.wms.domain.product.repository.ProductFlowRepository;
import com.a302.wms.domain.product.service.ProductFlowServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/product-flows")
@RequiredArgsConstructor
public class ProductFlowController {
  private final ProductFlowServiceImpl productFlowServiceImpl;

  @GetMapping
  public BaseSuccessResponse<List<ProductFlowResponse>> getAllProductFlows(
      @RequestParam(name = "userId") Long userId) {

    return new BaseSuccessResponse<>(productFlowServiceImpl.findAllByUserId(userId));
  }
}
