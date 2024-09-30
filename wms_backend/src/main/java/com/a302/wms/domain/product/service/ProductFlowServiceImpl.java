package com.a302.wms.domain.product.service;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.product.dto.ProductFlowResponse;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.mapper.ProductFlowMapper;
import com.a302.wms.domain.product.repository.ProductFlowRepository;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductFlowServiceImpl {

    private final ProductFlowRepository productFlowRepository;
    private final FloorRepository floorRepository;


    /**
     * product_flow table에 데이터 저장
     * @param previousFloor : (입고 | 이동 )전 상품의 층
     * @param present : (입고 | 이동 ) 후 상품 데이터
     * @param productFlowTypeEnum : 작업 유형 (입고 | 이동 )
     * @param flowDate : (입고 | 이동 ) 일시
     */
    public void save(Product present,
                     LocalDateTime flowDate,
                     Floor previousFloor,
                     ProductFlowTypeEnum productFlowTypeEnum) {
        productFlowRepository.save(ProductFlowMapper.fromProduct(present,
                flowDate,
                previousFloor,
                productFlowTypeEnum));
    }

    public List<ProductFlowResponse> findAllByUserId(Long userId) {

        return productFlowRepository.findAll().stream()
                .filter((productFlow -> productFlow.getUserId().equals(userId)))
                .map((productFlow -> ProductFlowMapper.toProductFlowResponseDto(
                        productFlow,
                        floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                        floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow()
                ))).toList();
//        return productFlowRepository.findAll().stream()
//                .map((productFlow -> ProductFlowMapper.toProductFlowResponseDto(
//                        productFlow,
//                        floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
//                        floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow()
//                ))).toList();

    }
   }

