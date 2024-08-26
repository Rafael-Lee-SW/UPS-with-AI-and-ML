package com.a508.wms.product.service;

import static java.util.stream.Collectors.groupingBy;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.service.BusinessModuleService;
import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.exception.FloorException;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.floor.service.FloorService;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.repository.LocationRepository;
import com.a508.wms.location.service.LocationModuleService;
import com.a508.wms.location.service.LocationService;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.*;
import com.a508.wms.product.exception.ProductException;
import com.a508.wms.product.exception.ProductInvalidRequestException;
import com.a508.wms.product.mapper.ProductMapper;
import com.a508.wms.product.repository.ProductRepository;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.mapper.ProductDetailMapper;
import com.a508.wms.productdetail.service.ProductDetailModuleService;
import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.repository.WarehouseRepository;
import com.a508.wms.warehouse.service.WarehouseModuleService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.PriorityQueue;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductModuleService productModuleService;
    private final ProductDetailModuleService productDetailModuleService;
    private final FloorModuleService floorModuleService;
    private final BusinessModuleService businessModuleService;
    private final ProductRepository productRepository;
    private final int LIMIT_DAY = 1;
    private final WarehouseModuleService warehouseModuleService;
    private final LocationModuleService locationModuleService;
    private final LocationService locationService;
    private final ProductFlowModuleService productFlowModuleService;
    private final LocationRepository locationRepository;
    private final WarehouseRepository warehouseRepository;
    private final FloorService floorService;
    private List<ExportTypeEnum> orderedExportType = List.of(ExportTypeEnum.STORE,
        ExportTypeEnum.DISPLAY, ExportTypeEnum.KEEP);

    /**
     * 서비스의 모든 상품을 반환하는 기능
     *
     * @return
     */
    public List<ProductResponseDto> findAll() {
        log.info("[Service] find Products");
        final List<Product> products = productModuleService.findAll();

        return products.stream()
            .map(ProductMapper::toProductResponseDto)
            .toList();
    }


    /**
     * 특정 상품을 반환하는 기능
     *
     * @param id 상품(Product)의 id
     * @return
     */
    public ProductResponseDto findById(Long id) {
        log.info("[Service] find Products by id: {}", id);
        try {
            Product product = productModuleService.findById(id);

            return ProductMapper.toProductResponseDto(product);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("id", id);
        }


    }

//    /**
//     * 특정 상품정보에 해당하는 상품들을 반환하는 기능
//     *
//     * @param productDetailId 상품정보(ProductDetail) id
//     * @return
//     */
//    public List<ProductResponseDto> findByProductDetailId(Long productDetailId) {
//        log.info("[Service] find Products by productDetailId: {}", productDetailId);
//
//        try {
//            productDetailModuleService.findById(productDetailId);
//        } catch (IllegalArgumentException e) {
//            throw new ProductInvalidRequestException("productDetailId", productDetailId);
//        }
//        final List<Product> products = productModuleService.findByProductDetailId(productDetailId);
//
//        return products.stream()
//                .map(ProductMapper::toProductResponseDto)
//                .toList();
//    }

    /**
     * 특정 사업자에 해당하는 상품들을 반환하는 기능
     *
     * @param businessId 사업자(Business) id
     * @return
     */

    public List<ProductResponseDto> findByBusinessId(Long businessId) {
        log.info("[Service] find Products by businessId: {}", businessId);

        try {
            businessModuleService.findById(businessId);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("businessId", businessId);
        }

        final List<Product> products = productModuleService.findByBusinessId(businessId);

        return products.stream()
            .map(ProductMapper::toProductResponseDto)
            .toList();

    }

    /**
     * 창고 id에 해당하는 상품들을 반환하는 기능
     *
     * @param warehouseId 창고(Warehouse)의 id
     * @return
     */
    public List<ProductResponseDto> findByWarehouseId(Long warehouseId) {
        log.info("[Service] find Products by warehouseId: {}", warehouseId);

        if (warehouseModuleService.notExist(warehouseId)) {
            throw new ProductInvalidRequestException("warehouseId", warehouseId);
        }

        final List<Product> products = productModuleService.findByWarehouseId(warehouseId);

        return products.stream()
            .map(ProductMapper::toProductResponseDto)
            .toList();
    }

    /**
     * 특정 로케이션에 들어있는 Product들을 반환하는 기능
     *
     * @param locationId location의 id
     * @return
     */
    @Transactional
    public List<ProductResponseDto> findByLocationId(Long locationId) {
        log.info("[Service] find Products by locationId: {}", locationId);

        if (locationModuleService.notExist(locationId)) {
            throw new ProductInvalidRequestException("locationId", locationId);
        }

        final List<Product> products = productModuleService.findByLocationId(locationId);
        return products.stream()
            .map((product) ->
                {
                    ProductResponseDto productResponseDto = ProductMapper.toProductResponseDto(product);
                    productResponseDto.setFloorLevel(product.getFloor().getFloorLevel());
                    productResponseDto.setLocationName(product.getFloor().getLocation().getName());

                    return productResponseDto;
                }
            )
            .toList();
    }

    public void updateAll(List<ProductUpdateRequestDto> requestDtos) {
        log.info("[Service] update Products :");
        for (ProductUpdateRequestDto productUpdateRequestDto : requestDtos) {
            update(productUpdateRequestDto);
        }
    }

    /**
     * 기존 상품 데이터를 조회하여 수정하는 기능
     *
     * @param request 수정할 상품 데이터
     */
    public void update(ProductUpdateRequestDto request) {
        log.info("[Service] update Product by id: {}", request.getProductId());
        try {
            productModuleService.update(request);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("request", request);
        }

    }

    /**
     * 상품의 상태값을 삭제로 변경, 해당 상품에 해당하는 모든 상품 로케이션 또한 변경.
     *
     * @param id 상품의 id
     */
    @Transactional
    public void delete(Long id) {
        log.info("[Service] delete Product by id: {}", id);
        try {
            Product product = productModuleService.findById(id);
            product.updateStatus(StatusEnum.DELETED);
            productModuleService.save(product);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("id", id);
        }
    }

    /**
     * 상품들의 입고처리를 수행
     *
     * @param requests : dto
     */
    @Transactional
    public void importProducts(List<ProductRequestDto> requests) {
        log.info("[Service] import Products ");

        Long warehouseId = requests.stream().map(
            ProductRequestDto::getWarehouseId).findAny().orElse(null);
        Long businessId = warehouseModuleService.findById(warehouseId).getBusiness().getId();
        importValidate(businessId, warehouseId);

        Floor defaultFloor = floorModuleService.findDefaultFloorByWarehouse(warehouseId);

        requests
            .forEach(data -> {
                importProduct(data, businessId,
                    defaultFloor);
            });
    }

    private void importValidate(Long businessId, Long warehouseId) {
        try {
            Warehouse warehouse = warehouseModuleService.findById(warehouseId);

            if (!Objects.equals(warehouse.getBusiness().getId(), businessId)) {
                throw new ProductInvalidRequestException("businessId", businessId);
            }
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("warehouseId", warehouseId);
        }

    }

    /**
     * 한 상품의 입고처리를 수행함 입고로 들어온 상품이 DB에 있는지 확인한다. 상품의 동등성 판단은 상품 정보 id와 유톻기한으로 한다. 있다면 해당 상품의 총 수량을
     * 입고량만큼 추가해준다. 없다면 새로 상품을 추가한다. 추가: 입고 정보를 입고 테이블에 추가한다.
     *
     * @param request
     * @param defaultFloor 입고 처리 된 상품이 들어가는 default 층
     */
    private void importProduct(ProductRequestDto request, Long businessId,
        Floor defaultFloor) {
        log.info("[Service] import Product by productData: {}", request);

        ProductDetail productDetail = findOrCreateProductDetail(request, businessId);
        Product product = ProductMapper.fromProductData(request, productDetail, defaultFloor);

        productModuleService.save(product);
//        importModuleService.save(request, product);
        productFlowModuleService.saveImport(request, product);
    }

    /**
     * 저장하려는 상품정보가 현재 DB에 있는지 확인하고 없으면 추가하는 기능
     *
     * @param request
     * @return
     */
    private ProductDetail findOrCreateProductDetail(ProductRequestDto request,
        Long businessId) {
        log.info("[Service] find or create Product by productData: {}", request);
        Optional<ProductDetail> optionalProductDetail = productDetailModuleService.findByBusinessIdAndBarcode(
            businessId, request.getBarcode());

        if (optionalProductDetail.isPresent()) {
            return optionalProductDetail.get();
        }

        Business business = businessModuleService.findById(businessId);

        ProductDetail productDetail = ProductDetailMapper.fromProductImportData(request, business);

        return productDetailModuleService.save(productDetail);
    }

    /**
     * 물품들의 출고 판단 및 처리를 하는 기능
     *
     * @param request
     * @return
     */
    @Transactional
    public List<ProductExportResponseDto> exportProducts(ProductExportRequestDto request) {
        log.info("[Service] export Products by ProductExportRequestDto: {}", request);
        try {
            businessModuleService.findById(request.getBusinessId());
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("businessId", request.getBusinessId());
        }

        productQuantityCheck(request);

        List<ExportResponseDto> datas = request.getData();
        Map<String, List<ExportResponseDto>> exports = datas.stream()
            .collect(groupingBy(ExportResponseDto::getTrackingNumber));

        List<Warehouse> warehouses = warehouseModuleService.findByBusinessId(
            request.getBusinessId());
        List<ProductExportResponseDto> result = exports.entrySet().stream()
            .map(entry -> {
                Map<String, List<ExportResponseDto>> path = calculatePath(entry.getValue(),
                    warehouses, request.getBusinessId());
                return ProductExportResponseDto.builder()
                    .path(path)
                    .build();
            }).toList();
        Business business = businessModuleService.findById(request.getBusinessId());

        for (ProductExportResponseDto responseDto : result) {
            Map<String, List<ExportResponseDto>> path = responseDto.getPath();
            for (Map.Entry<String, List<ExportResponseDto>> entry : path.entrySet()) {
                List<ExportResponseDto> dataLists = entry.getValue();

                for (ExportResponseDto exportResponseDto : dataLists) {
                    productFlowModuleService.saveExport(exportResponseDto, business);
                }
            }
        }
        return result;
    }

    /**
     * 각 송장별 출고 처리를 진행하여 결과 경로를 반환하는 기능
     *
     * @param invoice : 한 송장의 출고 상품 내역 정보
     * @return
     */
    private Map<String, List<ExportResponseDto>> calculatePath(
        List<ExportResponseDto> invoice, long businessId) {
        log.info("[Service] calculate export path of exportData: {}", invoice);

        Map<String, List<ExportResponseDto>> path = new HashMap<>();
        for (ExportResponseDto exportResponseDto : invoice) {
            List<ProductPickingLocationDto> candidates = productRepository.findPickingLocation(
                exportResponseDto.getBarcode(), businessId);
            PriorityQueue<ProductPickingLocationDto> priorityQueue = new PriorityQueue<>(
                Comparator
                    .comparing(ProductPickingLocationDto::getExpirationDate,
                        Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(ProductPickingLocationDto::getQuantity,
                        Comparator.reverseOrder())
            );

            priorityQueue.addAll(candidates);

            int remains = exportResponseDto.getQuantity();
            for (ProductPickingLocationDto dto : priorityQueue) {
                if (dto.getQuantity() == 0) {
                    continue;
                }
                if (dto.getQuantity() >= remains) {
                    updateProductQuantity(dto.getProductId(),
                        dto.getQuantity() - remains);

                    List<ExportResponseDto> pickings = path.getOrDefault(
                        dto.getWarehouseName(), new ArrayList<>());

                    pickings.add(ExportResponseDto.builder()
                        .expirationDate(dto.getExpirationDate())
                        .trackingNumber(exportResponseDto.getTrackingNumber())
                        .barcode(exportResponseDto.getBarcode())
                        .locationName(dto.getLocationName())
                        .floorLevel(dto.getFloorLevel())
                        .productName(dto.getProductName())
                        .quantity(remains)
                        .date(LocalDateTime.now().withNano(0))
                        .productStorageType(dto.getProductStorageType())
                        .warehouseName(dto.getWarehouseName())
                        .warehouseId(dto.getWarehouseId())
                        .build());
                    path.put(dto.getWarehouseName(), pickings);
                    break;
                }

                remains -= dto.getQuantity();

                updateProductQuantity(dto.getProductId(), 0);

                List<ExportResponseDto> pickings = path.getOrDefault(
                    dto.getWarehouseName(), new ArrayList<>());

                pickings.add(ExportResponseDto.builder()
                    .expirationDate(dto.getExpirationDate())
                    .trackingNumber(exportResponseDto.getTrackingNumber())
                    .barcode(exportResponseDto.getBarcode())
                    .locationName(dto.getLocationName())
                    .floorLevel(dto.getFloorLevel())
                    .productName(dto.getProductName())
                    .quantity(dto.getQuantity())
                    .date(LocalDateTime.now().withNano(0))
                    .productStorageType(dto.getProductStorageType())
                    .warehouseName(dto.getWarehouseName())
                    .warehouseId(dto.getWarehouseId())
                    .build());
                path.put(dto.getWarehouseName(), pickings);
            }


        }

        return path;
    }

    /**
     * 출고되는 물품의 수량을 변경하는 로직
     *
     * @param productId
     * @param quantity
     */

    private void updateProductQuantity(Long productId, int quantity) {
        log.info("[Service] update Product quantity by productId: {}", productId);
        Product product = productModuleService.findById(productId);

        product.updateData(quantity);

        productModuleService.save(product);
    }

    /**
     * 현제 출고 명령이 재고상 가능한 상태인지 판단해주는 기능,예외처리 안되면 출고 가능
     *
     * @param request
     */
    private void productQuantityCheck(ProductExportRequestDto request) {
        log.info("[Service] check productQuantity by ProductExportRequestDto: {}", request);

        Long businessId = request.getBusinessId();
        List<ExportResponseDto> datas = request.getData();

        Map<Long, Integer> productTotalCount = datas.stream().collect(
            groupingBy((ExportResponseDto::getBarcode),
                Collectors.summingInt(ExportResponseDto::getQuantity)));

        Map<Long, Integer> productQuantityResult = productTotalCount.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey,
                entry -> calculateProductQuantity(entry.getKey(), entry.getValue(), businessId)));

        if (containsImpossibleExportProduct(productQuantityResult)) {
            //throw new ProductExportException("수량 부족");
        }

        List<Long> movingProductBarcodes = new ArrayList<>();

        productQuantityResult.entrySet().stream()
            .filter(entry -> entry.getValue() == 1)
            .forEach(entry -> movingProductBarcodes.add(entry.getKey()));

        if (!movingProductBarcodes.isEmpty()) {
//            throw new ProductExportException(
//                "해당 물품들의 이동이 필요합니다." + movingProductBarcodes);
            throw new IllegalArgumentException("해당 물품들의 이동이 필요합니다." + movingProductBarcodes);
        }
    }

    /**
     * 전체 재고량이 부족하여 출고가 불가능한 경우가 있는지 확인하는 기능.
     *
     * @param productQuantityResult
     * @return
     */
    private boolean containsImpossibleExportProduct(Map<Long, Integer> productQuantityResult) {
        return productQuantityResult.entrySet().stream()
            .anyMatch(entry -> entry.getValue() == 2);
    }

    /**
     * 각 물품별 재고에 따른 출고 가능 여부를 확인하여 매핑해주는 기능.
     *
     * @param barcode
     * @param quantity
     * @param businessId
     * @return
     */
    private Integer calculateProductQuantity(Long barcode, Integer quantity, Long businessId) {
        log.info("[Service] calculate Product quantity of import product by barcode: {}", barcode);
        ProductQuantityDto productQuantityDto = productModuleService.findProductQuantityByBarcodeAndBusinessId(
            barcode, businessId);
        if (productQuantityDto.getPossibleQuantity() >= quantity) {
            return 0;
        }

        if (productQuantityDto.getPossibleQuantity() +
            productQuantityDto.getMovableQuantity() >= quantity) {
            return 1;
        }

        return 2;
    }


    /**
     * 특정 사업자의 Product 중 유통기한이 머지 않았거나,이미 지난 상품을 반환하는 기능 .
     *
     * @param businessId 사업자의 id
     * @return
     */
    @Transactional
    public List<ExpirationProductResponseDto> findExpirationProducts(Long businessId) {
        log.info("[Service] find Expired Warning Product by businessId: {}", businessId);
        LocalDateTime currentTime = LocalDateTime.now().withNano(0);

        List<Product> products = productModuleService.findByBusinessId(businessId)
            .stream()
            .filter(product -> product.getExpirationDate() != null)
            .toList();

        List<Product> expirationSoonProducts = products.stream()
            .filter(product -> isExpiredSoonProduct(product, currentTime))
            .toList();

        List<Product> expirationExpiredProducts = products.stream()
            .filter(product -> isAlreadyExpiredProduct(product, currentTime))
            .toList();

        return mergeAndConvertExpirationProducts(expirationSoonProducts, expirationExpiredProducts);
    }

    /**
     * Product의 유통기한이 얼마 안남았는지 여부를 반환하는 기능.
     *
     * @param product     상품
     * @param currentTime 현재 시간
     * @return
     */
    private boolean isExpiredSoonProduct(Product product, LocalDateTime currentTime) {
        return product.getExpirationDate().isAfter(currentTime) && product.getExpirationDate()
            .isBefore(currentTime.plusDays(LIMIT_DAY));
    }

    /**
     * Product의 유통기한이 이미 지났는지 여부를 반환하는 기능.
     *
     * @param product
     * @param currentTime
     * @return
     */
    private boolean isAlreadyExpiredProduct(Product product, LocalDateTime currentTime) {
        return product.getExpirationDate().isBefore(currentTime);
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

    public List<?> findAllByBusinessId(Long businessId) {
        return productModuleService.findAllByBusinessId(businessId);
    }

    /**
     * 상품 이동 여러개
     *
     * @param requests
     * @return
     * @throws ProductException
     */
    @Transactional
    public List<ProductMoveResponseDto> moveProducts(List<ProductMoveRequestDto> requests)
        throws ProductException {
        List<ProductMoveResponseDto> moves = new ArrayList<>();

        for (ProductMoveRequestDto request : requests) {
            moves.add(moveProduct(request));
        }

        return moves;
    }

    /**
     * 각각 상품 이동
     *
     * @param request
     * @return
     * @throws ProductException
     */
    @Transactional
    public ProductMoveResponseDto moveProduct(ProductMoveRequestDto request)
        throws ProductException {
        try {
            Product originalProduct = productModuleService.findById(request.getProductId());
            originalProduct.updateData(originalProduct.getQuantity() - request.getQuantity());

            Location location = locationService.findByNameAndWarehouseId(
                request.getLocationName(),
                request.getWarehouseId());
            List<Floor> floors = floorModuleService.findAllByLocationId(location.getId());
            Floor moveFloor = null;
            for (Floor floor : floors) {
                if (floor.getLocation().getName().equals(request.getLocationName())
                    && (floor.getFloorLevel() == request.getFloorLevel())) {
                    moveFloor = floor;
                    break;
                }
            }
            Product moveProduct = Product.builder()
                .productDetail(originalProduct.getProductDetail())
                .quantity(request.getQuantity())
                .expirationDate(originalProduct.getExpirationDate())
                .floor(moveFloor)
                .build();
            productModuleService.save(originalProduct);
            productModuleService.save(moveProduct);

            ProductMoveResponseDto response = ProductMapper.toProductMoveResponseDto(moveProduct,
                request.getWarehouseId(),
                location.getWarehouse().getName(),
                request.getLocationName(),
                location.getName(),
                request.getFloorLevel(),
                moveFloor.getFloorLevel());

            productFlowModuleService.saveMove(response,
                moveProduct.getProductDetail().getBusiness());
            return response;
        } catch (NullPointerException e) {
            throw new ProductException.NotFountException(request.getProductId());
        }
    }

    public List<ProductExportResponseDto> exportTest(ProductExportRequestDto request) {
        //1. Warehouse를 타입 우선순위(매장->창고),우선순위 컬럼을 기준으로 정렬
        List<Warehouse> orderedWarehouse = warehouseRepository.findExportOrderWarehouse(
            request.getBusinessId());

        //2. Warehouse를 순회하면서 각 물건들을 빼올 창고를 찾음
        List<ExportResponseDto> exportData = request.getData();

        //2.1 각 송장번호별로 로직을 수행 (송장번호 별로 묶음)
        Map<String, List<ExportResponseDto>> exports = exportData.stream()
            .collect(groupingBy(ExportResponseDto::getTrackingNumber));

        //2.2 경로를 계산함.
        List<ProductExportResponseDto> result = exports.entrySet().stream()
            .map(entry -> {
                Map<String, List<ExportResponseDto>> path = calculatePath(entry.getValue(),
                    orderedWarehouse, request.getBusinessId());
                return ProductExportResponseDto.builder()
                    .path(path)
                    .build();
            }).toList();

        Business business = businessModuleService.findById(request.getBusinessId());

        for (ProductExportResponseDto responseDto : result) {
            Map<String, List<ExportResponseDto>> path = responseDto.getPath();
            for (Map.Entry<String, List<ExportResponseDto>> entry : path.entrySet()) {
                List<ExportResponseDto> dataLists = entry.getValue();

                for (ExportResponseDto exportResponseDto : dataLists) {
                    productFlowModuleService.saveExport(exportResponseDto, business);
                }
            }
        }

        return result;
    }

    public Map<String, List<ExportResponseDto>> calculatePath(List<ExportResponseDto> exportData,
        List<Warehouse> orderedWarehouse, Long businessId) {
        Map<Warehouse, List<ExportResponseDto>> totalPath = new HashMap<>();
        String trackingNumber = exportData.get(0).getTrackingNumber();

        //해당 송장에 들어있는 모든 상품의 바코드 리스트
        List<Long> productBarcodes = exportData.stream()
            .map(ExportResponseDto::getBarcode)
            .toList();

        //송장의 상품들이 들어있는 창고들을 우선순위로 정렬한 창고 기준으로 filtering해서 모은 Map
        Map<Warehouse, List<Product>> productWarehouse = orderedWarehouse.stream()
            .collect(Collectors.toMap(
                warehouse -> warehouse,
                warehouse -> {
                    List<Product> products = productRepository.findByWarehouseId(warehouse.getId());

                    return products.stream()
                        .filter(product -> {
                            return productBarcodes.contains(
                                product.getProductDetail().getBarcode());
                        })
                        .toList();
                })
            )
            .entrySet().stream()
            .filter(entry -> !entry.getValue().isEmpty())
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        //창고별로 무조건 방문해야 하는 위치
        Map<Warehouse, Map<Location, List<Pair<Product, Integer>>>> essentialVisitPoint = new HashMap<>();

        //창고별 상품의 로케이션 후보지
        Map<Warehouse, Map<Pair<ProductDetail, Integer>, List<Product>>> cadidateVisitPoint = new HashMap<>();

        for (ExportResponseDto exportResponseDto : exportData) {
            ProductDetail productDetail = productDetailModuleService.findByBusinessIdAndBarcode(
                businessId, exportResponseDto.getBarcode()).get();

            //해당 상품만 있는 후보군만 모은 Map
            Map<Warehouse, List<Product>> targetWarehouseMap = productWarehouse.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey,
                    entry -> entry.getValue().stream()
                        .filter(product -> product.getProductDetail().equals(productDetail))
                        .toList()))
                .entrySet().stream()
                .filter(entry -> !entry.getValue().isEmpty())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

            int remainQuantity = exportResponseDto.getQuantity();

            for (Map.Entry<Warehouse, List<Product>> entry : targetWarehouseMap.entrySet()) {
                if (remainQuantity == 0) {
                    break;
                }

                Warehouse warehouse = entry.getKey();
                List<Product> products = entry.getValue();
                int totalQuantityOfWarehouse = entry.getValue().stream()
                    .mapToInt(Product::getQuantity)
                    .sum();

                if (totalQuantityOfWarehouse <= remainQuantity) {
                    //모든 위치 넣기
                    products.stream()
                        .forEach(product -> {
                            Map<Location, List<Pair<Product, Integer>>> locations = essentialVisitPoint.getOrDefault(
                                warehouse, new HashMap<>());

                            Location productLocation = product.getFloor().getLocation();
                            List<Pair<Product, Integer>> locationProducts = locations.getOrDefault(
                                productLocation, new ArrayList<>());

                            locationProducts.add(Pair.of(product, product.getQuantity()));
                            locations.put(productLocation, locationProducts);
                            essentialVisitPoint.put(warehouse, locations);
                        });
                    remainQuantity -= totalQuantityOfWarehouse;
                } else {
                    //출고타입으로 분류
                    Map<ExportTypeEnum, List<Product>> exportTypeProducts = products.stream()
                        .collect(groupingBy((product -> product.getFloor().getExportTypeEnum())));

                    //출고타입 우선순위로 조회
                    for (ExportTypeEnum exportType : orderedExportType) {
                        if (!exportTypeProducts.containsKey(exportType)) {
                            continue;
                        }

                        List<Product> exportProducts = exportTypeProducts.get(exportType);

                        int exportTotalQuantity = exportProducts.stream()
                            .mapToInt(Product::getQuantity)
                            .sum();

                        if (exportTotalQuantity <= remainQuantity) {
                            exportProducts.stream()
                                .forEach(product -> {
                                    Map<Location, List<Pair<Product, Integer>>> locations = essentialVisitPoint.getOrDefault(
                                        warehouse, new HashMap<>());

                                    Location productLocation = product.getFloor().getLocation();
                                    List<Pair<Product, Integer>> locationProducts = locations.getOrDefault(
                                        productLocation, new ArrayList<>());

                                    locationProducts.add(Pair.of(product, product.getQuantity()));
                                    locations.put(productLocation, locationProducts);
                                    essentialVisitPoint.put(warehouse, locations);
                                });
                            remainQuantity -= exportTotalQuantity;
                        } else {
                            //
                            for (Product product : exportProducts) {

                                Map<Location, List<Pair<Product, Integer>>> locations = essentialVisitPoint.getOrDefault(
                                    warehouse, new HashMap<>());

                                Location productLocation = product.getFloor().getLocation();
                                List<Pair<Product, Integer>> locationProducts = locations.getOrDefault(
                                    productLocation, new ArrayList<>());

                                if (product.getQuantity() >= remainQuantity) {
                                    locationProducts.add(Pair.of(product, remainQuantity));
                                    locations.put(productLocation, locationProducts);
                                    essentialVisitPoint.put(warehouse, locations);
                                    remainQuantity = 0;
                                    break;
                                }
                                locationProducts.add(Pair.of(product, product.getQuantity()));
                                locations.put(productLocation, locationProducts);
                                essentialVisitPoint.put(warehouse, locations);
                                remainQuantity -= product.getQuantity();
                            }
                            if (essentialVisitPoint.get(warehouse) != null) {
                                //이전 로직에서 방문을 해야한다고 확정이 난 로케이션
                                Set<Location> essentialLocations = essentialVisitPoint.get(
                                        warehouse)
                                    .keySet();

                                //위의 로케이션과 같은 곳에 있는 상품
                                List<Product> nextEssentialProducts = exportProducts.stream()
                                    .filter(product -> {
                                        Location currentLocation = product.getFloor().getLocation();
                                        return essentialLocations.contains(currentLocation);
                                    })
                                    .toList();

                                for (Product nextEssentialProduct : nextEssentialProducts) {
                                    Map<Location, List<Pair<Product, Integer>>> locations = essentialVisitPoint.get(
                                        warehouse);

                                    Location productLocation = nextEssentialProduct.getFloor()
                                        .getLocation();
                                    List<Pair<Product, Integer>> locationProducts = locations.get(
                                        productLocation);

                                    if (nextEssentialProduct.getQuantity() <= remainQuantity) {
                                        locationProducts.add(
                                            Pair.of(nextEssentialProduct,
                                                nextEssentialProduct.getQuantity()));
                                        locations.put(productLocation, locationProducts);

                                        remainQuantity -= nextEssentialProduct.getQuantity();
                                    } else {
                                        locationProducts.add(
                                            Pair.of(nextEssentialProduct,
                                                remainQuantity));
                                        locations.put(productLocation, locationProducts);

                                        remainQuantity = 0;
                                        break;
                                    }
                                }

                                if (remainQuantity == 0) { //기존에 설정된 로케이션으로 전부 처리할수 있음
                                    break;
                                } else {
                                    List<Product> remainProducts = exportProducts.stream()
                                        .filter(product -> {
                                            Location currentLocation = product.getFloor()
                                                .getLocation();
                                            return !essentialLocations.contains(currentLocation);
                                        })
                                        .toList();

                                    Map<Pair<ProductDetail, Integer>, List<Product>> cadidateProducts = cadidateVisitPoint.getOrDefault(
                                        warehouse, new HashMap<>());

                                    cadidateProducts.put(Pair.of(productDetail, remainQuantity),
                                        remainProducts);
                                    cadidateVisitPoint.put(warehouse, cadidateProducts);

                                    remainQuantity = 0;
                                    break;
                                }
                            }
                            //여기에 path 추가해줘야함
                        }
                    }
                }
            }
        }
        //후보지에서 다시 탐색
        for (Warehouse warehouse : essentialVisitPoint.keySet()) {
            Map<Location, List<Pair<Product, Integer>>> locations = essentialVisitPoint.get(
                warehouse);

            Set<Location> essentialLocations = locations.keySet();

            //없을수도 있기때문에 넘기는거 표시(없을수 있나?
            if (!cadidateVisitPoint.containsKey(warehouse)) {
                continue;
            }

            //해당 창고에서의 후보지
            Map<Pair<ProductDetail, Integer>, List<Product>> candidateProducts = cadidateVisitPoint.get(
                warehouse);

            //최종적인 후보지.
            Map<Pair<ProductDetail, Integer>, List<Product>> finalCandidateProducts = new HashMap<>();

            //후보지들을 상품정보별로 순회
            for (Pair<ProductDetail, Integer> remainProduct : candidateProducts.keySet()) {
                List<Product> candidateProduct = candidateProducts.get(remainProduct);

                int remainQuantity = remainProduct.getSecond();

                //방문 필요 로케이션에 포함되는 후보지.
                List<Product> addingProduct = candidateProduct.stream()
                    .filter(product -> {
                        Location location = product.getFloor().getLocation();
                        return essentialLocations.contains(location);
                    })
                    .toList();

                for (Product p : addingProduct) {
                    if (remainQuantity == 0) {
                        break;
                    }
                    int quantity = p.getQuantity();

                    if (remainQuantity >= quantity) {
                        List<Pair<Product, Integer>> products = locations.get(
                            p.getFloor().getLocation());
                        products.add(Pair.of(p, quantity));

                        locations.put(p.getFloor().getLocation(), products);
                        remainQuantity -= quantity;

                    } else {
                        List<Pair<Product, Integer>> products = locations.get(
                            p.getFloor().getLocation());
                        products.add(Pair.of(p, remainQuantity));

                        locations.put(p.getFloor().getLocation(), products);
                        remainQuantity = 0;
                    }
                }

                if (remainQuantity != 0) { //후보군 다제거함.
                    List<Product> finalCandidateProduct = candidateProduct.stream()
                        .filter(product -> {
                            Location location = product.getFloor().getLocation();
                            return !essentialLocations.contains(location);
                        })
                        .toList();

                    finalCandidateProducts.put(Pair.of(remainProduct.getFirst(), remainQuantity),
                        finalCandidateProduct);
                }

                cadidateVisitPoint.put(warehouse, finalCandidateProducts);
            }

            essentialVisitPoint.put(warehouse, locations);
        }
        //최종 경로 찾기

        //각 창고의 경로
        for (Warehouse warehouse : essentialVisitPoint.keySet()) {
            List<Location> essentialLocations = essentialVisitPoint.get(warehouse).keySet().stream()
                .toList();

            Map<Pair<ProductDetail, Integer>, List<Product>> candidateProducts = cadidateVisitPoint.get(
                warehouse);

            Map<ProductDetail, List<List<Pair<Product, Integer>>>> candidateCombinations;

            if (candidateProducts == null) {
                candidateCombinations = null;
            } else {
                candidateCombinations =
                    candidateProducts.entrySet().stream()
                        .collect(Collectors.toMap(
                            entry -> entry.getKey().getFirst(),
                            entry -> getAllCombination(entry.getKey().getSecond(), entry.getValue())
                        ));
            }

            List<List<Pair<Product, Integer>>> combinedResults;

            if (candidateCombinations == null) {
                combinedResults = new ArrayList<>();
                combinedResults.add(new ArrayList<>());
            } else {
                combinedResults = combine(candidateCombinations);
            }

            List<Pair<Product, Integer>> bestPathSet = new ArrayList<>();
            List<Location> bestPath = new ArrayList<>();

            double minDist = Double.MAX_VALUE;
            for (List<Pair<Product, Integer>> candidateComb : combinedResults) {
                List<Location> combinedLocations;

                if (candidateCombinations == null) {
                    combinedLocations = essentialLocations;
                } else {
                    combinedLocations = combineLocations(candidateComb,
                        essentialLocations);
                }

                double distSum = 0.0;

                List<Location> path = new ArrayList<>();

                //시작점(현재는 01-01)
                Location start = locationRepository.findByNameAndWarehouseId("01-01",
                    warehouse.getId());

                //시작점에서 제일 가까운점 구하기
                boolean[] visited = new boolean[combinedLocations.size()];

                double minStartDist = Double.MAX_VALUE;
                int cur = -1;
                for (int i = 0; i < combinedLocations.size(); i++) {
                    double startDist = distanceTo(start, combinedLocations.get(i));

                    if (minStartDist > startDist) {
                        cur = i;
                        minStartDist = startDist;
                    }
                }

                distSum += minStartDist;
                visited[cur] = true;
                path.add(combinedLocations.get(cur));
                //각 점에서 부터 최단거리 구하기
                int visitedLength = 1;

                while (visitedLength < combinedLocations.size()) {
                    double minBetDist = Double.MAX_VALUE;
                    int next = -1;

                    for (int i = 0; i < combinedLocations.size(); i++) {
                        if (visited[i]) {
                            continue;
                        }

                        double betDist = distanceTo(combinedLocations.get(cur),
                            combinedLocations.get(i));

                        if (minBetDist > betDist) {
                            next = i;
                            minBetDist = betDist;
                        }
                    }

                    distSum += minBetDist;
                    visited[next] = true;
                    cur = next;
                    path.add(combinedLocations.get(cur));
                    visitedLength++;
                }

                //마지막 점에서 도착점까지 가기(현재는 없음)

                if (distSum < minDist) {
                    minDist = distSum;
                    bestPath = path;
                    bestPathSet = candidateComb;
                }
            }

            //bestPath를 통해 각 로케이션에서 꺼낼거 꺼내기. (재고반영 및 return값 만들기)
            Map<Location, List<Pair<Product, Integer>>> essentialProducts = essentialVisitPoint.get(
                warehouse);
            if (candidateCombinations != null) {
                for (Pair<Product, Integer> bestPair : bestPathSet) {
                    Location currentLocation = bestPair.getFirst().getFloor().getLocation();

                    List<Pair<Product, Integer>> products = essentialProducts.get(currentLocation);
                    products.add(bestPair);
                    essentialProducts.put(currentLocation, products);
                }
            }
            List<ExportResponseDto> paths = new ArrayList<>();
            for (Location bestLocation : bestPath) {
                List<Pair<Product, Integer>> products = essentialProducts.get(bestLocation);
                for (Pair<Product, Integer> pair : products) {
                    Product product = pair.getFirst();
                    int reduceQuantity = pair.getSecond();

                    //경로 추가
                    paths.add(ExportResponseDto.builder()
                        .trackingNumber(trackingNumber)
                        .barcode(product.getProductDetail().getBarcode())
                        .locationName(bestLocation.getName())
                        .productName(product.getProductDetail().getName())
                        .quantity(reduceQuantity)
                        .floorLevel(product.getFloor().getFloorLevel())
                        .date(LocalDateTime.now())
                        .expirationDate(product.getExpirationDate())
                        .productStorageType(product.getProductDetail().getProductStorageType())
                        .warehouseId(warehouse.getId())
                        .warehouseName(warehouse.getName())
                        .build());
                    //현황 반영
                    product.updateData(product.getQuantity() - reduceQuantity);
                    productModuleService.save(product);
                }
            }
            totalPath.put(warehouse, paths);
        }

        return totalPath.entrySet().stream()
            .collect(Collectors.toMap(
                entry -> entry.getKey().getName(), // 키 변환
                entry -> entry.getValue().stream()
                    .filter(dto -> dto.getQuantity() > 0) // quantity가 0이 아닌 경우만 필터링
                    .collect(Collectors.toList()) // 필터링된 리스트로 변환
            ));
    }

    public List<List<Pair<Product, Integer>>> getAllCombination(int quantity,
        List<Product> products) {
        List<List<Pair<Product, Integer>>> combinations = new ArrayList<>();

        List<Pair<Product, Integer>> combination = new ArrayList<>();
        backtracking(products, quantity, 0, combination, combinations);

        return combinations;
    }

    private void backtracking(List<Product> products, int remain, int start,
        List<Pair<Product, Integer>> combination,
        List<List<Pair<Product, Integer>>> combinations) {
        if (remain == 0) {
            combinations.add(combination);
            return;
        }
        for (int i = start; i < products.size(); i++) {
            Product product = products.get(i);
            int quantity = product.getQuantity();

            if (remain >= quantity) {
                combination.add(Pair.of(product, quantity));
                backtracking(products, remain - quantity, i + 1, combination, combinations);
            } else {
                combination.add(Pair.of(product, remain));
                backtracking(products, 0, i + 1, combination, combinations);
            }
            combination.remove(combination.size() - 1);
        }
    }

    public List<List<Pair<Product, Integer>>> combine(
        Map<ProductDetail, List<List<Pair<Product, Integer>>>> map) {
        List<List<Pair<Product, Integer>>> result = new ArrayList<>();
        List<ProductDetail> details = new ArrayList<>(map.keySet());

        backtrack(details, map, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(List<ProductDetail> details,
        Map<ProductDetail, List<List<Pair<Product, Integer>>>> map,
        int index,
        List<Pair<Product, Integer>> currentCombination,
        List<List<Pair<Product, Integer>>> result) {
        if (index == details.size()) {
            result.add(new ArrayList<>(currentCombination));
            return;
        }

        ProductDetail currentDetail = details.get(index);
        List<List<Pair<Product, Integer>>> currentLists = map.get(currentDetail);

        for (List<Pair<Product, Integer>> list : currentLists) {
            currentCombination.addAll(list);
            backtrack(details, map, index + 1, currentCombination, result);
            currentCombination.removeAll(list); // 백트래킹을 위해 추가한 요소 제거
        }
    }

    public List<Location> combineLocations(List<Pair<Product, Integer>> productPairs,
        List<Location> existingLocations) {
        // Pair에서 Location 추출 및 중복 제거
        Set<Location> newLocations = productPairs.stream()
            .map(pair -> pair.getFirst().getFloor().getLocation())
            .collect(Collectors.toSet());

        // 기존 List<Location>과 합치고 중복 제거
        newLocations.addAll(existingLocations);

        // 최종적으로 중복이 제거된 List<Location> 반환
        return new ArrayList<>(newLocations);
    }

    public double distanceTo(Location a, Location b) {
        return Math.sqrt(Math.pow(a.getXPosition() - b.getXPosition(), 2) + Math.pow(
            a.getYPosition() - b.getYPosition(), 2));
    }

    @Transactional
    public void compress(Long warehouseId, Long businessId) throws FloorException, ProductException {
        List<ProductCompressDtoInterface> displayFloors = floorService.findAllDisplayFloorByWarehouseId(warehouseId);

        List<ProductCompressDtoInterface> existDisplayProducts = productRepository.findAllDisplayByFloorLevelAndWarehouseId(warehouseId);

        List<Product> saveProducts = new ArrayList<>();

        for(ProductCompressDtoInterface dto : existDisplayProducts) {
            deleteByProductDetailIdAndWarehouseId(dto.getProductDetailId(),warehouseId);
        }
//        List<ProductMoveRequestDto> moveProductList = new ArrayList<>();

        for (int i = 0; i < Math.min(existDisplayProducts.size(), displayFloors.size()); i++) {
            saveProducts.add(Product.builder()
                    .quantity(existDisplayProducts.get(i).getQuantity())
                    .productDetail(productDetailModuleService.findById(existDisplayProducts.get(i).getProductDetailId()))
                    .floor(floorModuleService.findById(displayFloors.get(i).getFloorId()))
                    .build());
//            List<Product> current = productRepository.findByProductDetailId(existDisplayProducts.get(i).getProductDetailId());
//            for (Product product : current) {
//                moveProductList.add(ProductMoveRequestDto.builder()
//                                .productId(product.getId())
//                                .warehouseId(warehouseId)
//                                .locationName(displayFloors.get(i).getLocationName())
//                                .quantity(product.getQuantity())
//                                .floorLevel(1)
//                        .build());
//            }
        }
        productRepository.saveAll(saveProducts);
//        moveProducts(moveProductList);
    }

    @Modifying
    public void deleteByProductDetailIdAndWarehouseId(Long productDetailId, Long warehouseId) {
        productRepository.deleteByProductDetailIdAndWarehouseId(productDetailId,warehouseId);
    }

}
