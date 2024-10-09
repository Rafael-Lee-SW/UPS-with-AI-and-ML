package com.a302.wms.domain.product.service;


import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorServiceImpl;
import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.domain.notification.service.NotificationServiceImpl;
import com.a302.wms.domain.product.dto.ProductImportRequest;
import com.a302.wms.domain.product.dto.ProductMoveRequest;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.dto.ProductUpdateRequest;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.exception.ProductException;
import com.a302.wms.domain.product.exception.ProductInvalidRequestException;
import com.a302.wms.domain.product.mapper.ProductMapper;
import com.a302.wms.domain.product.repository.ProductRepository;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.structure.repository.LocationRepository;
import com.a302.wms.domain.structure.service.LocationServiceImpl;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.domain.user.service.UserServiceImpl;
import com.a302.wms.global.constant.NotificationTypeEnum;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import com.a302.wms.global.constant.ResponseEnum;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Consumer;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl {

    private final FloorServiceImpl floorService;
    private final ProductRepository productRepository;
    private final ProductFlowServiceImpl productFlowService;
    private final FloorRepository floorRepository;
    private final DeviceRepository deviceRepository;
    private final StoreRepository storeRepository;
    private final NotificationServiceImpl notificationServiceImpl;
    private final UserServiceImpl userServiceImpl;
    private final UserRepository userRepository;
    private final LocationServiceImpl locationServiceImpl;
    private final LocationRepository locationRepository;
    private final LocalContainerEntityManagerFactoryBean entityManagerFactory;

    /**
     * 특정 유저의 모든 상품 호출
     *
     * @param userId : 찾을 유저의 id
     * @return : userId에 해당하는 모든 상품 리스트
     */
    public List<ProductResponse> findAllByUserId(Long userId) {
        log.info("[Service] find Products");
        final List<Product> products = productRepository.findAllByUserId(userId);

        return products.stream().map(ProductMapper::toProductResponse).toList();
    }

    /**
     * 특정 상점의 모든 상품 호출
     *
     * @param storeId 찾을 매장의 id
     * @return storeId에 해당하는 모든 상품 리스트
     */
    public List<ProductResponse> findAllByStoreId(Long storeId) {
        log.info("[Service] find Products by storeId");

        final List<Product> products = productRepository.findByStoreId(storeId);

        return products.stream().map(ProductMapper::toProductResponse).toList();
    }

    /**
     * 상품 다중 업데이트
     *
     * @param productUpdateRequestList : 업데이트할 상품 정보 리스트
     */
    public void updateAll(List<ProductUpdateRequest> productUpdateRequestList) {
        log.info("[Service] update Products :");
        productUpdateRequestList.forEach(this::update);
    }

    /**
     * 상품 단일 수정
     *
     * @param productUpdateRequest 수정할 상품 정보
     */
    @Transactional
    public void update(ProductUpdateRequest productUpdateRequest) {
        log.info("[Service] update Product by productId ");
        try {
            Product product = productRepository.findById(productUpdateRequest.productId()).orElse(null);

            updateIfValid(productUpdateRequest.barcode(), product::updateBarcode);
            updateIfValid(productUpdateRequest.sku(), product::updateSku);
            updateIfValid(productUpdateRequest.productName(), product::updateProductName);
            updateIfValid(productUpdateRequest.quantity(), product::updateQuantity);
            updateIfValid(productUpdateRequest.originalPrice(), product::updateOriginalPrice);
            updateIfValid(productUpdateRequest.sellingPrice(), product::updateSellingPrice);
            log.info("[Service] update Product : {}, DTO : {}", product.getSku(), productUpdateRequest.toString());
            productRepository.save(product);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("productUpdateRequestDto", productUpdateRequest);
        }
    }

    /**
     * 상품 다중 삭제
     *
     * @param productIds : 삭제할 상품 id 리스트
     */
    public void deleteAll(List<Long> productIds) {
        productIds.forEach(this::deleteProduct);
    }

    /**
     * 상품 단일 삭제
     *
     * @param productId : 삭제할 상품 id
     */
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    /**
     * value가 유효한지 검사
     *
     * @param value : 유효한지 확인할 값
     * @param <T>   : 타입
     * @return 유효하면 true / 아니면 false
     */
    public <T> boolean isValid(T value) {
//    if (value == null) {
//      return false;
//    }
//
//    if (value instanceof String) {
//      return !((String) value).isBlank();
//    }
//
//    if (value instanceof LocalDateTime) {
//      return !((LocalDateTime) value).isAfter(LocalDateTime.now());
//    }
        return true;
    }

    /**
     * value가 유효하면 값을 업데이트
     *
     * @param value          : 유효한지 판단할 값
     * @param updateFunction : 업데이트할 함수
     * @param <T>            : 타입
     */
    private <T> void updateIfValid(T value, Consumer<T> updateFunction) {
        if (isValid(value)) {
            updateFunction.accept(value);
        }
    }

    /**
     * 상품 다중 이동
     *
     * @param productMoveRequestList : 이동할 상품 리스트
     * @throws ProductException
     */
    @Transactional
    public void moveProducts(List<ProductMoveRequest> productMoveRequestList)
            throws ProductException {
        for (ProductMoveRequest request : productMoveRequestList) {
            moveProduct(request);
        }
    }

    @Transactional
    public void swapProducts(ProductMoveRequest productMoveRequest) {
        Product productX = productRepository.findById(productMoveRequest.productId()).orElseThrow();
        Floor floorA = floorRepository.findByLocationIdAndFloorLevel(productMoveRequest.locationId(), productMoveRequest.floorLevel());
        Floor floorB = productX.getFloor();
        Product productY = floorA.getProduct();
        log.info("시작 전 productX 상태 : {}", productX);
        log.info("시작 전 productY 상태 : {}", productY);
        // 두 Product의 현재 Floor를 가져온다

        // Product X를 Floor A로, Product Y를 Floor B로 교체
        productX.updateFloor(floorA);
        productY.updateFloor(floorB);

        log.info("저장 전 productX 상태 : {}", productX);
        log.info("저장 전 productY 상태 : {}", productY);
        // 변경된 Product 엔티티를 저장한다
        floorA.updateProduct(productX);
        floorB.updateProduct(productY);

        log.info("현재 floorA 상태 : {}", floorA);
        log.info("현재 floorB 상태 : {}", floorB);
        productRepository.flush();
        floorRepository.flush();

    }

    /**
     * 단일 상품 이동
     *
     * @param productMoveRequest
     * @throws ProductException
     */
    @Transactional
    public void moveProduct(ProductMoveRequest productMoveRequest) throws ProductException {

        Product productX = productRepository.findById(productMoveRequest.productId()).orElseThrow();
        Floor floorA = floorRepository.findByLocationIdAndFloorLevel(productMoveRequest.locationId(), productMoveRequest.floorLevel());
        if (floorA == null) {
            throw new ProductException(ResponseEnum.BAD_REQUEST, "해당 층은 없는 층입니다.");
        }
        Floor floorB = productX.getFloor();
        if (floorA.getProduct() == null) {
            productX.updateFloor(floorA);
            floorA.updateProduct(productX);

            productRepository.flush();
            floorRepository.flush();
        } else {
            swapProducts(productMoveRequest);
        }

        Store store = productX.getStore();
        User user = userRepository.findById(store.getUser().getId()).orElse(null);

Notification notification = notificationServiceImpl.createNotification(user, store, NotificationTypeEnum.FLOW);

        notificationServiceImpl.save(notification);
        productFlowService.save(
                productX, LocalDateTime.now(), floorB, ProductFlowTypeEnum.FLOW,notification);



    }

    /**
     * 상품 다중 입고
     *
     * @param productImportRequestList : 입고할 상품 리스트
     */
    @Transactional
    public void importAll(List<ProductImportRequest> productImportRequestList) {
        log.info("[Service] import Products ");
        productImportRequestList.forEach(this::importProduct);
    }

    /**
     * 상품 단일 입고
     *
     * @param productImportRequest : 입고할 상품 정보
     */
    @Transactional
    public void importProduct(ProductImportRequest productImportRequest) {
        log.info("[Service] import Product by productImportRequest");

        Store store = storeRepository.findById(productImportRequest.storeId()).orElseThrow();
        Floor defaultFloor = floorService.findDefaultFloorByStore(productImportRequest.storeId());
        Product product =
                ProductMapper.fromProductImportRequest(productImportRequest, defaultFloor, store);

        productRepository.save(product);
        User user = userRepository.findById(store.getUser().getId()).orElse(null);
        Notification notification = notificationServiceImpl.createNotification(user, store, NotificationTypeEnum.IMPORT);
        productFlowService.save(product, LocalDateTime.now(), defaultFloor, ProductFlowTypeEnum.IMPORT, notification);
        notificationServiceImpl.save(notification);
    }

    public List<ProductResponse> findAllByLocationId(Long locationId) {
        return productRepository.findAllByLocationId(locationId).stream()
                .map(ProductMapper::toProductResponse).toList();
    }
}
