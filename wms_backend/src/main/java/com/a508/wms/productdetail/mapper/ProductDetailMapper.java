package com.a508.wms.productdetail.mapper;

import com.a508.wms.business.domain.Business;
import com.a508.wms.product.dto.ProductRequestDto;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import com.a508.wms.productdetail.dto.ProductDetailResponseDto;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ProductDetailMapper {

    /**
     * ProductDetail -> ProductDetailResponseDto
     *
     * @param productDetail : 변경할 productDetail
     * @return 변경된 ProductDetailResponseDto
     */
    public static ProductDetailResponseDto fromProductDetail(ProductDetail productDetail) {
        return ProductDetailResponseDto.builder()
                .id(productDetail.getId())
                .businessId(productDetail.getBusiness().getId())
                .barcode(productDetail.getBarcode())
                .name(productDetail.getName())
                .size(productDetail.getSize())
                .unit(productDetail.getUnit())
                .productStorageType(productDetail.getProductStorageType())
                .originalPrice(productDetail.getOriginalPrice())
                .sellingPrice(productDetail.getSellingPrice())
                .build();
    }

    /**
     * requestDto -> entity로 변환하는 기능
     *
     * @param productDetailRequestDto : 변경할 ProductDetailResponseDto
     * @return 변경된 ProductDetail
     */
    public static ProductDetail fromDto(ProductDetailRequestDto productDetailRequestDto) {
        return ProductDetail.builder()
                .productStorageType(productDetailRequestDto.getProductStorageType())
                .barcode(productDetailRequestDto.getBarcode())
                .name(productDetailRequestDto.getName())
                .size(productDetailRequestDto.getSize())
                .unit(productDetailRequestDto.getUnit())
                .originalPrice(productDetailRequestDto.getOriginalPrice())
                .sellingPrice(productDetailRequestDto.getSellingPrice())
                .build();
    }

    /**
     * ProductData -> ProductDetail
     *
     * @param productImportRequestData : 입력할 상품의 정보
     * @param business                 : 입력할 사업체 정보
     * @return 변경된 ProductDetail
     */
    public static ProductDetail fromProductImportData(
            ProductRequestDto productImportRequestData,
            Business business) {
        return ProductDetail.builder()
                .business(business)
                .productStorageType(Optional.ofNullable(
                        productImportRequestData.getProductStorageType())
                        .orElse(ProductStorageTypeEnum.상온))
                .barcode(productImportRequestData.getBarcode())
                .name(productImportRequestData.getName())
                .build();
    }
}
