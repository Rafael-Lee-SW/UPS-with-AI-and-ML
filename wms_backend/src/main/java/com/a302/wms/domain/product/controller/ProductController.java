package com.a302.wms.domain.product.controller;

import com.a302.wms.domain.device.dto.DeviceCreateRequest;
import com.a302.wms.domain.product.dto.ProductImportRequest;
import com.a302.wms.domain.product.dto.ProductMoveRequest;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.dto.ProductUpdateRequest;
import com.a302.wms.domain.product.exception.ProductException;
import com.a302.wms.domain.product.exception.ProductInvalidRequestException;
import com.a302.wms.domain.product.service.ProductServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

  private final ProductServiceImpl productService;



  /**
   * (매장 별/사용자 별) 상품들을 반환하는 메서드
   *
   * @param storeId 매장 id
   * @param userId 사용자 id
   * @return (매장 별 전체 상품 리스트 | 사용자 별 전체 상품 리스트)
   */
  @GetMapping
  public BaseSuccessResponse<List<ProductResponse>> getProducts(
      @RequestParam(required = false) Long storeId, @RequestParam(required = false) Long userId) {
    if (storeId != null) {
      log.info("[Controller] find Products by storeId");
      return new BaseSuccessResponse<>(productService.findAllByStoreId(storeId));
    } else if (userId != null) {
      log.info("[Controller] find Products by userId");
      return new BaseSuccessResponse<>(productService.findAllByUserId(userId));
    } else {
      throw new ProductInvalidRequestException("no Variable", "null");
    }
  }

  @DeleteMapping("/{productId}")
  public BaseSuccessResponse<Void> deleteProduct(@PathVariable Long productId) {
    productService.deleteProduct(productId);
    return new BaseSuccessResponse<>(null);
  }
  /**
   * 상품 다중 수정
   *
   * @param productUpdateRequestList 수정할 상품의 정보가 담긴 리스트
   */
  @PatchMapping("/batch")
  public BaseSuccessResponse<Void> updateProducts(
      @RequestBody List<ProductUpdateRequest> productUpdateRequestList) {
    log.info("[Controller] update Products");
    productService.updateAll(productUpdateRequestList);
    return new BaseSuccessResponse<>(null);
  }

  /**
   * 상품 다중 삭제
   *
   * @param productIds 삭제할 상품들의 id가 담긴 리스트
   */
  @DeleteMapping
  public BaseSuccessResponse<Void> deleteProducts(@RequestParam List<Long> productIds) {
    log.info("[Controller] delete Products");

    productService.deleteAll(productIds);

    return new BaseSuccessResponse<>(null);
  }

  /**
   * 상품 다중 입고 처리
   *
   * @param productImportRequestList 입고되는 상품들의 정보가 담린 리스트
   */
  @PostMapping("/import")
  public BaseSuccessResponse<Void> importProducts(
      @RequestBody List<ProductImportRequest> productImportRequestList) {
    log.info("[Controller] create Imports ");
    productService.importAll(productImportRequestList);
    return new BaseSuccessResponse<>(null);
  }

  /**
   * 상품 다중 이동
   *
   * @param productMoveRequestList 이동하는 상품들의 정보가 담긴 리스트
   */
  @PutMapping("/batch")
  public BaseSuccessResponse<Void> moveProducts(
      @RequestBody List<ProductMoveRequest> productMoveRequestList) throws ProductException {

    log.info("[Controller] find ProductMoveRequestDtoList");
    productService.moveProducts(productMoveRequestList);
    return new BaseSuccessResponse<>(null);
  }

}
