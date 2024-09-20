package com.a302.wms.product.service;

import com.a302.wms.product.entity.Product;
import com.a302.wms.product.entity.ProductFlow;
import com.a302.wms.product.dto.*;
import com.a302.wms.product.repository.ProductFlowRepository;
import com.a302.wms.util.constant.ProductFlowType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductFlowService {

    private final ProductFlowRepository productFlowRepository;


    public void saveData(Product previous,
                         Product present,
                         ProductFlowType productFlowType,
                         LocalDateTime flowDate) {
        productFlowRepository.save(
        ProductFlow.builder()
                .barcode(present.getBarcode())
                .quantity(present.getQuantity())
                .flowDate(LocalDateTime.now())
                .productSku(present.getSku())
                .productName(present.getProductName())
                .previousFloorId(previous.getFloor() != null ? previous.getFloor().getId() : null)
                .presentFloorId(present.getFloor().getId() != null ? present.getFloor().getId() : null)
                .productFlowType(productFlowType)
                .build());
    }
    public ProductFlowResponseDto findByStoreIdAndProductFlowType(Long storeId, ProductFlowType productFlowType) throws Exception {

        try {
            if (productFlowType.equals(ProductFlowType.FLOW))
                return productFlowRepository.findByStoreIdAndFlow(storeId);
            else if (productFlowType.equals(ProductFlowType.IMPORT))
                return productFlowRepository.findByStoreIdAndImport(storeId);
            else if (productFlowType.equals(ProductFlowType.MODIFY))
                return productFlowRepository.findByStoreIdAndModify(storeId);
            else {
                throw new Exception();
            }
        } catch (Exception e) {
            throw new Exception();
        }
    }

    public List<ProductFlowResponseDto> findByUserIdAndStoreId(Long userId, Long storeId) {
        return null;
    }

    public List<ProductFlowResponseDto> findByUserIdAndProductFlowType(Long userId, ProductFlowType productFlowType) {
    }
}
