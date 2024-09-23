package com.a302.wms.domain.product.service;

import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.entity.ProductFlow;
import com.a302.wms.domain.product.repository.ProductFlowRepository;
import com.a302.wms.product.dto.*;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductFlowService {

    private final ProductFlowRepository productFlowRepository;


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
                .build());
    }
   /* public ProductFlowResponseDto findByStoreIdAndProductFlowTypeEnum(Long storeId, ProductFlowTypeEnum productFlowTypeEnum) throws Exception {

        try {
            if (productFlowTypeEnum.equals(ProductFlowTypeEnum.FLOW))
                return productFlowRepository.findByStoreIdAndFlow(storeId);
            else if (productFlowTypeEnum.equals(ProductFlowTypeEnum.IMPORT))
                return productFlowRepository.findByStoreIdAndImport(storeId);
            else if (productFlowTypeEnum.equals(ProductFlowTypeEnum.MODIFY))
                return productFlowRepository.findByStoreIdAndModify(storeId);
            else {
                throw new Exception();
            }
        } catch (Exception e) {
            throw new Exception();
        }
    }

    public List<ProductFlowResponseDto> findAllByUserIdAndStoreId(Long userId, Long storeId) {

        return productFlowRepository.findAllByUserIdAndStoreId(userId, storeId);
    }

    public List<ProductFlowResponseDto> findAllByUserIdAndProductFlowTypeEnum(Long userId, ProductFlowTypeEnum productFlowTypeEnum) {

        return productFlowRepository.findAllByUserIdAndProductFlowType(userId,productFlowTypeEnum);
    }*/
}
