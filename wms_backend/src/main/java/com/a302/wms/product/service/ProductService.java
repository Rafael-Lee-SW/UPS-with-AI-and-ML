package com.a302.wms.product.service;

import com.a302.wms.floor.entity.Floor;
import com.a302.wms.floor.repository.FloorRepository;
import com.a302.wms.floor.service.FloorModuleService;
import com.a302.wms.location.repository.LocationRepository;
import com.a302.wms.location.service.LocationModuleService;
import com.a302.wms.location.service.LocationService;
import com.a302.wms.product.dto.*;
import com.a302.wms.product.entity.Product;
import com.a302.wms.product.exception.ProductException;
import com.a302.wms.product.exception.ProductInvalidRequestException;
import com.a302.wms.product.mapper.ProductMapper;
import com.a302.wms.product.repository.ProductRepository;
import com.a302.wms.store.service.StoreMoudleService;
import com.a302.wms.user.service.UserModuleService;
import com.a302.wms.util.constant.ProductFlowType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static com.a302.wms.util.constant.ProductConstant.LIMIT_DAY;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final FloorModuleService floorModuleService;
    private final UserModuleService userModuleService;
    private final ProductRepository productRepository;
    private final StoreMoudleService storeMoudleService;
    private final LocationModuleService locationModuleService;
    private final LocationService locationService;
    private final ProductFlowService productFlowService;
    private final LocationRepository locationRepository;
    private final FloorRepository floorRepository;

    /**
     * 서비스의 모든 상품을 반환하는 기능
     *
     * @return
     */
    public List<ProductResponseDto> findAll() {
        log.info("[Service] find Products");
        final List<Product> products = productRepository.findAll();

        return products.stream()
                .map(ProductMapper::toProductResponseDto)
                .toList();
    }

    /**
     * 특정 상품을 반환하는 기능
     *
     * @param id 상품(Product)의 productId
     * @return
     */
    public ProductResponseDto findById(Long id) {
        log.info("[Service] find Products by productId: {}", id);
        try {
            Product product = productRepository.findById(id).orElseThrow();

            return ProductMapper.toProductResponseDto(product);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("id", id);
        }


    }

    /**
     * 매장 id에 해당하는 상품들을 반환하는 기능
     *
     * @param storeId 매장(Store)의 productId
     * @return
     */
    public List<ProductResponseDto> findByStoreId(Long storeId) {
        log.info("[Service] find Products by storeId: {}", storeId);

        if (storeMoudleService.notExist(storeId)) {
            throw new ProductInvalidRequestException("storeId", storeId);
        }

        final List<Product> products = productRepository.findByStoreId(storeId);

        return products.stream()
                .map(ProductMapper::toProductResponseDto)
                .toList();
    }

    /**
     * 특정 로케이션에 들어있는 Product들을 반환하는 기능
     *
     * @param locationId location의 productId
     * @return
     */
    @Transactional
    public List<ProductResponseDto> findByLocationId(Long locationId) {
        log.info("[Service] find Products by locationId: {}", locationId);

        if (locationModuleService.notExist(locationId)) {
            throw new ProductInvalidRequestException("locationId", locationId);
        }

        final List<Product> products = productRepository.findByLocationId(locationId);
        return products.stream()
                .map(ProductMapper::toProductResponseDto)
                .toList();
    }

    /**
     * User의 모든 상품 반환
     *
     * @param userId
     * @return
     */
    public List<Product> findByUserId(Long userId) {
        return productRepository.findByUserId(userId);
    }


    /**
     * 요청받은 모든 상품의 정보를 업데이트
     *
     * @param requestDtos
     */
    public void updateAll(List<ProductUpdateRequestDto> requestDtos) {
        log.info("[Service] update Products :");
        requestDtos.forEach(this::update);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    /**
     * value가 유효한지 검사하는 메서드
     *
     * @param value
     * @param <T>
     * @return
     */
    public <T> boolean isValid(T value) {
        if (value == null) {
            return false;
        }
        if (value instanceof String) {
            return !((String) value).isBlank();
        }
        if (value instanceof LocalDateTime) {
            return !((LocalDateTime) value).isAfter(LocalDateTime.now());
        }
        return true;
    }

    /**
     * isValid가 true라면 update를 수행함
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
     * 기존 상품 데이터를 조회하여 수정
     *
     * @param request 수정할 상품 데이터
     */
    public void update(ProductUpdateRequestDto request) {
        log.info("[Service] update Product by productId: {}", request.productId());
        try {
            Product product = productRepository.findById(request.productId()).orElse(null);

            updateIfValid(request.barcode(), product::updateBarcode);
            updateIfValid(request.sku(), product::updateSku);
            updateIfValid(request.productName(), product::updateProductName);
            updateIfValid(request.quantity(), product::updateQuantity);
            updateIfValid(request.originalPrice(), product::updateOriginalPrice);
            updateIfValid(request.sellingPrice(), product::updateSellingPrice);
            updateIfValid(request.expirationDate(), product::updateExpirationDate);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("request", request);
        }

    }

    /**
     * 상품의 상태값을 삭제로 변경, 해당 상품에 해당하는 모든 상품 로케이션 또한 변경.
     *
     * @param id 상품의 productId
     */
    @Transactional
    public void delete(Long id) {
        log.info("[Service] delete Product by productId: {}", id);
        try {
            Product product = productRepository.findById(id).orElseThrow();
            productRepository.delete(product);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("id", id);
        }
    }

    /**
     * 한 상품의 입고처리를 수행함
     * 입고량만큼 추가하고, 입고 정보를 입고 테이블에 추가한다.
     *
     * @param request
     * @param defaultFloor 입고 처리 된 상품이 들어가는 default 층
     */
    private void importProduct(ProductImportRequestDto request,
                               Floor defaultFloor) {
        log.info("[Service] import Product by productData: {}", request);

        Product product = ProductMapper.fromProductImportRequestDto(request, defaultFloor);

        productRepository.save(product);

        productFlowService.saveData(null, product, ProductFlowType.IMPORT, LocalDateTime.now());
    }

    /**
     * 상품들의 입고처리를 수행
     *
     * @param requests : dto List
     */
    @Transactional
    public void importProducts(List<ProductImportRequestDto> requests) {
        log.info("[Service] import Products ");
        requests.forEach(data -> importProduct(data,
                floorModuleService.findDefaultFloorByStore(data.storeId())));
    }

    /**
     * 특정 사업자의 Product 중 유통기한이 머지 않았거나,이미 지난 상품을 반환하는 기능 .
     *
     * @param userId 사업자의 productId
     * @return
     */
    @Transactional
    public List<ExpirationProductResponseDto> findExpirationProducts(Long userId) {
        log.info("[Service] find Expired Warning Product by userId: {}", userId);
        LocalDateTime presentTime = LocalDateTime.now().withNano(0);

        List<Product> products = findByUserId(userId)
                .stream()
                .filter(product -> product.getExpirationDate() != null)
                .toList();

        List<Product> expirationSoonProducts = products.stream()
                .filter(product -> isExpiredSoonProduct(product, presentTime))
                .toList();

        List<Product> expirationExpiredProducts = products.stream()
                .filter(product -> isAlreadyExpiredProduct(product, presentTime))
                .toList();

        return mergeAndConvertExpirationProducts(expirationSoonProducts, expirationExpiredProducts);
    }

    /**
     * Product의 유통기한이 얼마 안남았는지 여부를 반환하는 기능.
     *
     * @param product     상품
     * @param presentTime 현재 시간
     * @return
     */
    private boolean isExpiredSoonProduct(Product product, LocalDateTime presentTime) {
        return product.getExpirationDate().isAfter(presentTime) && product.getExpirationDate()
                .isBefore(presentTime.plusDays(LIMIT_DAY));
    }

    /**
     * Product의 유통기한이 이미 지났는지 여부를 반환하는 기능.
     *
     * @param product
     * @param presentTime
     * @return
     */
    private boolean isAlreadyExpiredProduct(Product product, LocalDateTime presentTime) {
        return product.getExpirationDate().isBefore(presentTime);
    }

    /**
     * 유통기한에 관련된 두 리스트를 하나의 반환 리스트로 병합하여 반환하는 기능.
     *
     * @param expirationSoonProducts
     * @param expirationExpiredProducts
     * @return
     */
    private List<ExpirationProductResponseDto> mergeAndConvertExpirationProducts(
            List<Product> expirationSoonProducts, List<Product> expirationExpiredProducts) {
        return Stream.concat(
                expirationSoonProducts.stream()
                        .map(product -> ProductMapper.toExpirationProductResponseDto(product, false))
                ,
                expirationExpiredProducts.stream()
                        .map(product -> ProductMapper.toExpirationProductResponseDto(product, true))
        ).toList();
    }


    /**
     * 상품 이동 여러개
     *
     * @param requests
     * @return
     * @throws ProductException
     */
    @Transactional
    public void moveProducts(List<ProductMoveRequestDto> requests)
            throws ProductException {
        for (ProductMoveRequestDto request : requests) {
            moveProduct(request);
        }
    }

    /**
     * 각각 상품 이동
     *
     * @param request
     * @return
     * @throws ProductException
     */
    @Transactional
    public void moveProduct(ProductMoveRequestDto request)
            throws ProductException {
        try {
            // 1. 현재 상품 찾기
            Product product = productRepository.findById(request.productId())
                    .orElseThrow();

            // 2. 옮길 위치의 floor 찾기
            Floor targetFloor = floorRepository.findAllByLocationId(request.locationId()).stream()
                    .filter((data) -> data.getFloorLevel() == request.floorLevel())
                    .findFirst()
                    .orElse(null);
            Product previous = null;
            if (targetFloor.getProduct() != null) {
                throw new ProductException.NotFoundException(product.getProductId());
            }
            // 3. 기존 상품의 floor 연결 끊기 / 현재 상품 데이터를 floor에 옮기기

            // floor 객체를 변경하고 상품에 업데이트
            else {
                previous = Product.builder()
                        .floor(product.getFloor()).build();
                // 연결 끊기
                Floor presentFloor = product.getFloor();
                presentFloor.updateProduct(null);
                // 새 floor 연결하기
                updateIfValid(targetFloor, product::updateFloor);
            }

            // product_flow에 변경하고 업데이트:별개의 함수
            productFlowService.saveData(previous, product, ProductFlowType.FLOW, request.movementDate());
        } catch (NullPointerException e) {
            throw new ProductException.NotFoundException(request.productId());
        }
    }

}
