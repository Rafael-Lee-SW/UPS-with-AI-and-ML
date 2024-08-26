package com.a508.wms.productdetail.controller;

import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import com.a508.wms.productdetail.dto.ProductDetailResponseDto;
import com.a508.wms.productdetail.service.ProductDetailService;
import com.a508.wms.util.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/productDetails")
@RequiredArgsConstructor
public class ProductDetailController {

    private final ProductDetailService productDetailService;

    /**
     * (서비스 전체 / 사업체 별) 상품 정보 조회
     *
     * @param businessId: 사업체 id
     * @return 상품 정보
     */
    @GetMapping
    public BaseSuccessResponse<List<ProductDetailResponseDto>> findAllByBusinessId(
            @RequestParam(required = false) Long businessId) {
        if (businessId != null) {
            log.info("[Controller] find ProductDetails by businessId: {}", businessId);
            return new BaseSuccessResponse<>(
                    productDetailService.findAllByBusinessId(businessId));
        } else {
            log.info("find ProductDetails");
            return new BaseSuccessResponse<>(productDetailService.findAll());
        }
    }

    /**
     * 상품 정보를 등록하는 기능
     *
     * @param request : 상품 정보
     */
    @PostMapping
    public BaseSuccessResponse<Void> save(
            @RequestBody ProductDetailRequestDto request) {
        log.info("[Controller] save ProductDetail: {}", request);
        productDetailService.save(request);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 상품 정보를 수정하는 기능
     *
     * @param id      상품 정보 ID
     * @param request 상품 정보 수정 Data
     */

    @PutMapping("/{id}")
    public BaseSuccessResponse<Void> update(@PathVariable Long id,
                                            @RequestBody ProductDetailRequestDto request) {
        log.info("[Controller] update ProductDetail by id:{} ", id);
        productDetailService.update(id, request);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 상품 정보의 상태값을 삭제로 변경, 해당 상품정보에 연관되는 모든 데이터의 상태 또한 삭제로 변경
     *
     * @param id 상품 정보 ID
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteProductDetail(@PathVariable Long id) {
        log.info("[Controller] delete ProductDetail by id:{}", id);
        productDetailService.delete(id);
        return new BaseSuccessResponse<>(null);
    }

}
