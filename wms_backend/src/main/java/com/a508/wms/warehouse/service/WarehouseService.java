package com.a508.wms.warehouse.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.service.BusinessModuleService;
import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.dto.LocationResponseDto;
import com.a508.wms.location.mapper.LocationMapper;
import com.a508.wms.location.service.LocationModuleService;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.service.ProductModuleService;
import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.FacilityTypeEnum;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.dto.LocationsAndWallsRequestDto;
import com.a508.wms.warehouse.dto.WallDto;
import com.a508.wms.warehouse.dto.WallRequestDto;
import com.a508.wms.warehouse.dto.WarehouseByBusinessDto;
import com.a508.wms.warehouse.dto.WarehouseDetailResponseDto;
import com.a508.wms.warehouse.dto.WarehouseDto;
import com.a508.wms.warehouse.mapper.WallMapper;
import com.a508.wms.warehouse.mapper.WarehouseMapper;
import com.a508.wms.warehouse.repository.WarehouseRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseModuleService warehouseModuleService;
    private final BusinessModuleService businessModuleService;
    private final LocationModuleService locationModuleService;
    private final FloorModuleService floorModuleService;
    private final WallModuleService wallModuleService;
    private final ProductModuleService productModuleService;
    private final WarehouseRepository warehouseRepository;

    /**
     * 최초 창고를 생성하는 메서드
     *
     * @param warehouseDto
     * @return
     */
    @Transactional
    public WarehouseDto save(WarehouseDto warehouseDto) {
        log.info("[Service] save Warehouse");
        Warehouse warehouse = createWarehouse(warehouseDto);
        warehouse = warehouseModuleService.save(warehouse);
        Location defaultLocation = Location.builder()
            .productStorageType(ProductStorageTypeEnum.상온)
            .warehouse(warehouse)
            .build();
        locationModuleService.save(defaultLocation);

        Floor defaultFloor = Floor.builder()
            .location(defaultLocation)
            .exportTypeEnum(ExportTypeEnum.IMPORT)
            .floorLevel(-1)
            .build();
        floorModuleService.save(defaultFloor);

        return WarehouseMapper.fromWarehouse(warehouse);
    }

    /**
     * 비지니스 id로 창고 목록을 조회하는 메서드
     *
     * @param businessId
     * @return
     */
    public List<WarehouseByBusinessDto> findByBusinessId(Long businessId) {
        log.info("[Service] find Warehouses with business id {}", businessId);
        List<Warehouse> warehouses = warehouseModuleService.findByBusinessId(
            businessId); // 창고 목록 조회

        return warehouses.stream()
            .map(WarehouseMapper::toWarehouseByBusinessDto)
            .toList();
    }

    /**
     * 창고 id로 창고를 조회하는 메서드
     *
     * @param id
     * @return
     */
    @Transactional
    public WarehouseDetailResponseDto findById(Long id) {
        log.info("[Service] find Warehouse with id {}", id);
        Warehouse warehouse = warehouseModuleService.findById(id);

        List<LocationResponseDto> locations = locationModuleService.findAllByWarehouseId(
                id)
            .stream()
            .map(location -> LocationMapper.toLocationResponseDto(location,
                getMaxFloorCapacity(location)))
            .toList();

        List<WallDto> walls = wallModuleService.findByWarehouseId(id)
            .stream()
            .map(WallMapper::toWallDto)
            .toList();

        return WarehouseMapper.toWarehouseDetailResponseDto(warehouse, locations, walls);
    }

    /**
     * 프론트에 랜더링 되는 Location과 Wall의 정보를 수정하는 메서드
     *
     * @param id
     * @param request
     * @return
     */
    @Transactional
    public WarehouseDetailResponseDto updateLocationsAndWalls(
        Long id, LocationsAndWallsRequestDto request) {
        log.info("[Service] update Warehouse Locations And Walls by id: {}", id);
        Warehouse warehouse = warehouseModuleService.findById(id);

        List<LocationResponseDto> locations = request.getLocations().stream()
            .map(location -> LocationMapper.fromLocationUpdateDto(location, warehouse))
            .map(locationModuleService::save)
            .map(location -> LocationMapper.toLocationResponseDto(location,
                getMaxFloorCapacity(location)))
            .toList();

        List<WallDto> walls = request.getWalls().stream()
            .map(wall -> WallMapper.fromDto(wall, warehouse))
            .map(wallModuleService::save)
            .map(WallMapper::toWallDto)
            .toList();

        return WarehouseMapper.toWarehouseDetailResponseDto(warehouse, locations, walls);
    }

    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorModuleService.findAllByLocationId(location.getId());

        return floors.stream()
            .mapToInt(floorModuleService::getCapacity)
            .max()
            .orElse(0);
    }

    /**
     * 창고를 삭제하는 메서드 (상태 값을 DELETED로 변경)
     *
     * @param id
     */
    @Transactional
    public void delete(Long id) {
        log.info("[Service] delete Warehouse by id: {}", id);
        Warehouse warehouse = warehouseModuleService.findById(id);
        warehouseModuleService.delete(warehouse);
    }

    private int calculateRowCount(int size) {
        double sizeInSquareMeters = size * 3.305785; // 평을 제곱미터로 변환
        return (int) Math.sqrt(sizeInSquareMeters); // 제곱근 계산
    }

    private Warehouse createWarehouse(WarehouseDto warehouseDto) /*throws WarehouseException */ {

        Business business = businessModuleService.findById(warehouseDto.getBusinessId());

//        if(business == null)
//            throw new WarehouseException.BusinessNotFoundException("businessId가 올바르지 않습니다.",ResponseEnum.BAD_REQUEST);
//        if (warehouseDto.getSize() <= 0) {
//            throw new WarehouseException.InvalidInputException("유효하지 않은 창고 크기입니다.", ResponseEnum.BAD_REQUEST);
//        }
//        if (warehouseDto.getName() == null || warehouseDto.getName().trim().isEmpty()) {
//            throw new WarehouseException.InvalidInputException("창고 이름이 입력되지 않았습니다.", ResponseEnum.BAD_REQUEST);
//        }
//        if (warehouseDto.getPriority() == 0) {
//            throw new WarehouseException.InvalidInputException("창고 우선순위가 입력되지 않았습니다.", ResponseEnum.BAD_REQUEST);
//        }
//        if (warehouseDto.getFacilityTypeEnum() == null) {
//            throw new WarehouseException.InvalidInputException("창고 유형이 입력되지 않았습니다.", ResponseEnum.BAD_REQUEST);
//        }

        //수직 배치수 수평 배치수 계산
        int rowCnt = calculateRowCount(warehouseDto.getSize());
        //수직 배치수 수평 배치수 계산
        int columnCnt = calculateRowCount(warehouseDto.getSize());
        return Warehouse.builder()
            .business(business)
            .size(warehouseDto.getSize())
            .name(warehouseDto.getName())
            .rowCount(rowCnt)
            .columnCount(columnCnt)
            .priority(warehouseDto.getPriority())
            .facilityTypeEnum(warehouseDto.getFacilityTypeEnum())
            .build();
    }

    public void saveAllWall(WallRequestDto saveRequest) {
        log.info("[Service] save All Wall");
        Warehouse warehouse = warehouseModuleService.findById(saveRequest.getWarehouseId());
        for (WallDto request : saveRequest.getWallDtos()) {
            wallModuleService.save(WallMapper.fromDto(request, warehouse));
        }
    }

    public int findWarehouseCntByBusinessId(Long businessId) {
        // 실제 로직을 여기에 구현합니다.
        // 예를 들어, 레포지토리를 사용하여 비즈니스 ID에 해당하는 창고 수를 조회합니다.
        return warehouseRepository.countByBusinessId(businessId);
    }

    public int findAllPscCount(Long id) {
        List<Product> products = productModuleService.findByWarehouseId(id);
        return products.stream()
            .mapToInt(Product::getQuantity)
            .sum();
    }

    public int findLocationCnt(Long id) {
        List<Location> locations = locationModuleService.findAllByWarehouseId(id);
        return locations.stream()
            .filter(location -> location.getZSize() > 0)
            .mapToInt(Location::getZSize)
            .sum();
    }

    public int findUsage(Long id) {
        List<Location> locations = locationModuleService.findAllByWarehouseId(id);
        List<Floor> floors = floorModuleService.findAllNotEmptyFloorByWarehouseId(id);

        int totalCnt = locations.stream()
            .filter(location -> location.getZSize() > 0)
            .mapToInt(Location::getZSize)
            .sum();

        if(totalCnt == 0){
            return 0;
        }

        return Math.max(1, floors.size() * 100 / totalCnt);
    }

    public int findPurpose(Long id) {
        Warehouse warehouse = warehouseModuleService.findById(id);

        if (warehouse.getFacilityTypeEnum() == FacilityTypeEnum.STORE) {
            return 1;
        } else if (warehouse.getPriority() == 1) {
            return 2;
        }

        return 3;
    }

}
