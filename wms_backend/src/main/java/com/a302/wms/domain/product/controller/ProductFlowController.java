package com.a302.wms.domain.product.controller;

import com.a302.wms.domain.product.dto.ProductFlowResponseDto;
import com.a302.wms.domain.product.repository.ProductFlowRepository;
import com.a302.wms.domain.product.service.ProductFlowServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/product-flows")
@RequiredArgsConstructor
public class ProductFlowController {
    private final ProductFlowRepository productFlowRepository;
    private final ProductFlowServiceImpl productFlowServiceImpl;

    @GetMapping("/{userId}")
    public List<ProductFlowResponseDto> getProductFlows(@PathVariable Long userId) {
        return productFlowServiceImpl.findAllByUserId(userId);
    }

}
