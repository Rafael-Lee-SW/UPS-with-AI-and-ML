package com.a302.wms.domain.product.service;

import com.a302.wms.domain.structures.repository.FloorRepository;
import com.a302.wms.domain.product.dto.*;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.entity.ProductFlow;
import com.a302.wms.domain.product.mapper.ProductFlowMapper;
import com.a302.wms.domain.product.repository.ProductFlowRepository;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductFlowServiceImpl {

    private final ProductFlowRepository productFlowRepository;
    private final FloorRepository floorRepository;


    /**
     * product_flow table에 데이터 저장
     * @param previous : 작업 전 상품 데이터
     * @param present : 작업 후 상품 데이터
     * @param productFlowTypeEnum : 작업 유형
     * @param flowDate : 작업 일시
     */
    public void saveData(Product previous,
                         Product present,
                         ProductFlowTypeEnum productFlowTypeEnum,
                         LocalDateTime flowDate) {
        productFlowRepository.save(
        ProductFlow.builder()
                .barcode(present.getBarcode())
                .quantity(present.getQuantity())
                .flowDate(LocalDateTime.now())
                .sku(present.getSku())
                .productName(present.getProductName())
                .previousFloorId(previous.getFloor() != null ? previous.getFloor().getId() : null)
                .presentFloorId(present.getFloor().getId() != null ? present.getFloor().getId() : null)
                .productFlowTypeEnum(productFlowTypeEnum)
                .flowDate(flowDate)
                .build());
    }
    public List<ProductFlowResponse> findAllByUserId(Long userId) {
        List<ProductFlow> productFlowList =  productFlowRepository.findAllByUserId(userId);
        List<ProductFlowResponse> productFlowResponseList = new ArrayList<>();
        for (ProductFlow productFlow : productFlowList) {
            productFlowResponseList.add(
                    ProductFlowMapper.toProductFlowResponse(productFlow,
                            floorRepository.findById(productFlow.getPreviousFloorId()).get(),
                            floorRepository.findById(productFlow.getPresentFloorId()).get())
                            );
        }
        return productFlowResponseList;
    }
   }
