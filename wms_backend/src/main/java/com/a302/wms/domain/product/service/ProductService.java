package com.a302.wms.domain.product.service;

import com.a302.wms.domain.device.dto.DeviceRegisterRequestDto;
import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorService;
import com.a302.wms.domain.product.dto.*;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.mapper.ProductMapper;
import com.a302.wms.domain.product.repository.ProductRepository;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.global.constant.ProductConstant;
import com.a302.wms.domain.product.dto.*;
import com.a302.wms.domain.product.exception.ProductException;
import com.a302.wms.domain.product.exception.ProductInvalidRequestException;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Stream;


@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final FloorService floorService;
    private final ProductRepository productRepository;
    private final ProductFlowService productFlowService;
    private final FloorRepository floorRepository;
    private final DeviceRepository deviceRepository;

    /**
     * 해당 사업자의 모든 상품 호출
     *
     * @return
     */
    public List<ProductResponseDto> findAllByUserId(Long userId) {
        log.info("[Service] find Products");
        final List<Product> products = productRepository.findAllByUserId(userId);

        return products.stream()
                .map(ProductMapper::toProductResponseDto)
                .toList();
    }

    /**
     * 매장 id에 해당하는 상품들을 반환하는 기능
     *
     * @param storeId 매장(Store)의 productId
     * @return
     */
    public List<ProductResponseDto> findAllByStoreId(Long storeId) {
        log.info("[Service] find Products by storeId: {}", storeId);


        final List<Product> products = productRepository.findByStoreId(storeId);

        return products.stream()
                .map(ProductMapper::toProductResponseDto)
                .toList();
    }

    public List<ProductResponseDto> findAllByKioskKey(DeviceRegisterRequestDto dto) {
        log.info("[Service] find Products by kiosk key: {}", dto);

        Device device = deviceRepository.findByDeviceKey(dto.key()).orElseThrow();

        Store store = device.getStore();

        return findAllByStoreId(store.getId());
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

    public void deleteProducts(List<Long> productIds) {
        productIds.forEach(this::deleteProduct);
    }
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
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
     * value가 유효한지 검사
     *
     * @param value
     * @param <T>
     * @return
     */
    public <T> boolean isValid(T value) {
        if (value == null) {
            return false;
        }
//         타입이 문자열이라면 공백인지/null인지
        if (value instanceof String) {
            return !((String) value).isBlank();
        }
//        타입이 시간이라면 현재 이전 시간인지
        if (value instanceof LocalDateTime) {
            return !((LocalDateTime) value).isAfter(LocalDateTime.now());
        }
        return true;
    }

    /**
     * isValid가 true라면 update를 수행
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
            productFlowService.saveData(previous, product, ProductFlowTypeEnum.FLOW, request.movementDate());
        } catch (NullPointerException e) {
            throw new ProductException.NotFoundException(request.productId());
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

        productFlowService.saveData(null, product, ProductFlowTypeEnum.IMPORT, LocalDateTime.now());
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
                floorService.findDefaultFloorByStore(data.storeId())));
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

        List<Product> products = productRepository.findAllByUserId(userId)
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
                .isBefore(presentTime.plusDays(ProductConstant.LIMIT_DAY));
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


    public ProductResponseDto findById(Long id) {
        return ProductMapper.toProductResponseDto(productRepository.findById(id).orElse(null));
    }
}
