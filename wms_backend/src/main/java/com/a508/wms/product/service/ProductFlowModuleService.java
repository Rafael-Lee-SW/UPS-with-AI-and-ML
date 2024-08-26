package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.domain.ProductFlow;
import com.a508.wms.product.dto.*;
import com.a508.wms.product.exception.ProductInvalidRequestException;
import com.a508.wms.product.mapper.ProductFlowMapper;
import com.a508.wms.product.repository.ProductFlowRepository;
import com.a508.wms.warehouse.service.WarehouseModuleService;
import java.util.Collections;
import java.util.Comparator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductFlowModuleService {

    private final ProductFlowRepository productFlowRepository;
    private final BusinessRepository businessRepository;
    private final WarehouseModuleService warehouseModuleService;

    public void saveExport(ExportResponseDto exportResponseDto, Business business) {

        ProductFlow productFlow = ProductFlowMapper.fromExportProductResponseDto(exportResponseDto,business);
        productFlow.updateBusiness(business);
        productFlowRepository.save(productFlow);
    }
    public void saveImport(ProductRequestDto request, Product product) {

        Business business = product.getProductDetail().getBusiness();
        ProductFlow productFlow = ProductFlowMapper.fromImportResponseDto(request,business,
                warehouseModuleService.findById(request.getWarehouseId()).getName());
        productFlow.updateBusiness(business);
        productFlowRepository.save(productFlow);
    }
    public void saveMove(ProductMoveResponseDto productMoveResponseDto,
                         Business business) {
        ProductFlow productFlow = ProductFlowMapper.fromProductMoveResponseDto(productMoveResponseDto,
                business);
        productFlow.updateBusiness(business);
        productFlowRepository.save(productFlow);
    }

    public List<ProductFlowResponseDto> findAllByBusinessId(Long businessId) {
        if(!businessRepository.existsById(businessId)){
            throw new ProductInvalidRequestException("businessId",businessId);
        }
        List<ProductFlowResponseDto> productFlowResponseDtos = new ArrayList<>();
        List<ProductFlow> productFlows = productFlowRepository.findAllByBusinessId(businessId);
        for(ProductFlow productFlow : productFlows){
            productFlowResponseDtos.add(ProductFlowMapper.toProductFlowResponseDto(productFlow));
        }
        Collections.sort(productFlowResponseDtos, new Comparator<ProductFlowResponseDto>() {
            @Override
            public int compare(ProductFlowResponseDto o1, ProductFlowResponseDto o2) {
                return o2.getDate().compareTo(o1.getDate());
            }
        });
        return productFlowResponseDtos;
    }
}
