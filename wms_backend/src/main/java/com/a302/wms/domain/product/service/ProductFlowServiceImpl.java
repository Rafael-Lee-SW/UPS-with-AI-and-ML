package com.a302.wms.domain.product.service;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.domain.product.dto.ProductFlowResponse;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.mapper.ProductFlowMapper;
import com.a302.wms.domain.product.repository.ProductFlowRepository;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import java.time.LocalDateTime;
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
  private final StoreRepository storeRepository;

  /**
   * product_flow table에 데이터 저장
   *
   * @param previousFloor : (입고 | 이동 )전 상품의 층
   * @param present : (입고 | 이동 ) 후 상품 데이터
   * @param productFlowTypeEnum : 작업 유형 (입고 | 이동 )
   * @param flowDate : (입고 | 이동 ) 일시
   */
  public void save(
          Product present,
          LocalDateTime flowDate,
          Floor previousFloor,
          ProductFlowTypeEnum productFlowTypeEnum,
          Notification notification) {
    productFlowRepository.save(
        ProductFlowMapper.fromProduct(present, flowDate, previousFloor, productFlowTypeEnum,notification));

  }

  public List<ProductFlowResponse> findAllByUserId(Long userId) {

    return productFlowRepository.findAllByUserId(userId).stream()
        .map(
            (productFlow ->
                ProductFlowMapper.toProductFlowResponseDto(
                    productFlow,
                    floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                    floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow(),
                    storeRepository.findById(productFlow.getStoreId()).orElseThrow())))
        .toList();
  }

  public List<ProductFlowResponse> findAllByStoreId(Long storeId) {
    return productFlowRepository.findAllByStoreId(storeId).stream()
        .map(
            (productFlow ->
                ProductFlowMapper.toProductFlowResponseDto(
                    productFlow,
                    floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                    floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow(),
                    storeRepository.findById(productFlow.getStoreId()).orElseThrow())))
        .toList();
  }

  public List<ProductFlowResponse> findAllByNotificationId(Long notificationId) {
    return productFlowRepository.findAllByNotificationId(notificationId).stream()
            .map(
                    (productFlow ->
                            ProductFlowMapper.toProductFlowResponseDto(
                                    productFlow,
                                    floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                                    floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow(),
                                    storeRepository.findById(productFlow.getStoreId()).orElseThrow())))
            .toList();
  }

  public List<ProductFlowResponse> findAllByProductIdAndType(Long productId, String type) {
    return productFlowRepository.findAllByProductIdAndType(productId,ProductFlowTypeEnum.valueOf(type)).stream()
            .map(
                    (productFlow ->
                            ProductFlowMapper.toProductFlowResponseDto(
                                    productFlow,
                                    floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                                    floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow(),
                                    storeRepository.findById(productFlow.getStoreId()).orElseThrow())))
            .toList();
  }

  public List<ProductFlowResponse> findAllByProductId(Long productId) {
    return productFlowRepository.findAllByProductId(productId).stream()
            .map(
                    (productFlow ->
                            ProductFlowMapper.toProductFlowResponseDto(
                                    productFlow,
                                    floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                                    floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow(),
                                    storeRepository.findById(productFlow.getStoreId()).orElseThrow())))
            .toList();
  }

  public List<ProductFlowResponse> findAllByStartDateAndEndDate(LocalDateTime startDate, LocalDateTime endDate) {

    return productFlowRepository.findAllByStartDateAndEndDate(startDate,endDate).stream()
            .map(
                    (productFlow ->
                            ProductFlowMapper.toProductFlowResponseDto(
                                    productFlow,
                                    floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                                    floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow(),
                                    storeRepository.findById(productFlow.getStoreId()).orElseThrow())))
            .toList();
  }
  public List<ProductFlowResponse> findAllByStartDate(LocalDateTime startDate) {

    return productFlowRepository.findAllByStartDate(startDate).stream()
            .map(
                    (productFlow ->
                            ProductFlowMapper.toProductFlowResponseDto(
                                    productFlow,
                                    floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                                    floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow(),
                                    storeRepository.findById(productFlow.getStoreId()).orElseThrow())))
            .toList();
  }
  public List<ProductFlowResponse> findAllByEndDate(LocalDateTime endDate) {

    return productFlowRepository.findAllByEndDate(endDate).stream()
            .map(
                    (productFlow ->
                            ProductFlowMapper.toProductFlowResponseDto(
                                    productFlow,
                                    floorRepository.findById(productFlow.getPresentFloorId()).orElseThrow(),
                                    floorRepository.findById(productFlow.getPreviousFloorId()).orElseThrow(),
                                    storeRepository.findById(productFlow.getStoreId()).orElseThrow())))
            .toList();
  }
}
