package com.a508.wms.product.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.repository.FloorRepository;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.repository.LocationRepository;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ProductPickingLocationDto;
import com.a508.wms.product.dto.ProductQuantityDto;
import com.a508.wms.product.dto.ProductUpdateRequestDto;
import com.a508.wms.product.dto.ProductWithBusinessResponseDto;
import com.a508.wms.product.mapper.ProductMapper;
import com.a508.wms.product.repository.ProductRepository;
import com.a508.wms.productdetail.repository.ProductDetailRepository;
import com.a508.wms.productdetail.service.ProductDetailModuleService;
import com.a508.wms.productdetail.service.ProductDetailService;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductModuleService {

    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final FloorRepository floorRepository;
    private final ProductDetailService productDetailService;
    private final ProductDetailModuleService productDetailModuleService;
    private final ProductDetailRepository productDetailRepository;

    /**
     * 서비스의 모든 상품을 반환하는 기능
     *
     * @return
     */
    public List<Product> findAll() {
        log.info("[Service] find Products");
        return productRepository.findAll();
    }


    /**
     * 특정 상품을 반환하는 기능
     *
     * @param id 상품(Product)의 id
     * @return
     */
    public Product findById(Long id) {
        log.info("[Service] find Product by id: {}", id);
        return productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Product Id"));
    }

    /**
     * 특정 상품정보에 해당하는 상품들을 반환하는 기능
     *
     * @param productDetailId 상품정보(ProductDetail) id
     * @return
     */
    public List<Product> findByProductDetailId(Long productDetailId) {
        return productRepository.findByProductDetailId(productDetailId);
    }

    /**
     * 특정 사업자에 해당하는 상품들을 반환하는 기능
     *
     * @param businessId 사업자(Business) id
     * @return
     */

    public List<ProductWithBusinessResponseDto> findAllByBusinessId(Long businessId) {
        return productRepository.findAllByBusinessId(businessId)
            .stream().map((ProductMapper::toProductWithBusinessDto))
            .toList();
    }

    public List<Product> findByBusinessId(Long businessId) {
        return productRepository.findByBusinessId(businessId);
    }

    /**
     * 창고 id에 해당하는 상품들을 반환하는 기능
     *
     * @param warehouseId 창고(Warehouse)의 id
     * @return
     */
    public List<Product> findByWarehouseId(Long warehouseId) {
        return productRepository.findByWarehouseId(warehouseId);
    }

    public List<Product> findByLocationId(Long locationId) {
        return productRepository.findByLocationId(locationId);
    }

    public List<Product> findByFloor(Floor floor) {
        return productRepository.findByFloor(floor);
    }

    /**
     * 상품 id(PK)와 유통기한을 통해 특정한 상품을 반환하는 기능
     *
     * @param productId
     * @param expirationDate
     * @return
     */
    public Optional<Product> findByIdAndExpirationDate(Long productId,
        LocalDateTime expirationDate) {
        return productRepository.findByIdAndExpirationDate(productId, expirationDate);
    }

    /**
     * 사업체 id(PK)와 barcode를 통해 픽업 가능한 층을 반환하는 기능
     *
     * @param barcode
     * @param businessId
     * @return
     */
    public List<ProductPickingLocationDto> findPickingLocation(Long barcode, Long businessId) {
        return productRepository.findPickingLocation(barcode, businessId);
    }

    /**
     * 사업체 id(PK)와 barcode를 통해 export type별 합을 반환하는 기능
     *
     * @param barcode
     * @param businessId
     * @return
     */
    public ProductQuantityDto findProductQuantityByBarcodeAndBusinessId(Long barcode,
        Long businessId) {
        return productRepository.findQuantityByBarcodeAndBusinessId(
            barcode, businessId);
    }

//    /**
//     * ProductDetail값을 통해 Product를 저장하는 기능
//     *
//     * @param request: Product 데이터
//     */
//    public Product save(ProductRequestDto request, ProductDetail productDetail) {
//        Product product = new Product(productDetail, request.getQuantity(),
//            request.getExpirationDate(), request.getComment());
//
//        return save(product);
//    }


    public Product save(Product product) {
        return productRepository.save(product);
    }


    /**
     * 기존 상품 데이터를 조회하여 수정하는 기능
     *
     * @param request 수정할 상품 데이터
     */
    @Transactional
    public void update(ProductUpdateRequestDto request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid Product Id"));
        Location location = locationRepository.findByNameAndWarehouseId(request.getLocationName(),
            request.getProductRequestDto().getWarehouseId());
        Floor floor = floorRepository.findByLocationIdAndFloorLevel(location.getId(),
            request.getFloorLevel());
        if (floor == null) {
            throw new IllegalArgumentException("Invalid Floor Level");
        }
        product.updateWithProductDetail(request, floor);

        productRepository.save(product);
    }

    /**
     * 상품을 soft delete하는 기능.
     *
     * @param product
     * @return
     */
    public Product delete(Product product) {
        product.updateStatus(StatusEnum.DELETED);
        return save(product);
    }
}
