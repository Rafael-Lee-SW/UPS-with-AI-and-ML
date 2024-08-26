package com.a508.wms.location.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.dto.FloorRequestDto;
import com.a508.wms.floor.exception.FloorException;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.dto.LocationRequestDto;
import com.a508.wms.location.dto.LocationResponseDto;
import com.a508.wms.location.dto.LocationSaveRequestDto;
import com.a508.wms.location.dto.LocationStorageResponseDto;
import com.a508.wms.location.mapper.LocationMapper;
import com.a508.wms.location.repository.LocationRepository;
import com.a508.wms.product.dto.ProductMoveRequestDto;
import com.a508.wms.product.service.ProductModuleService;
import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.FacilityTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.service.WarehouseModuleService;
import jakarta.transaction.Transactional;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationService {

    private final LocationModuleService locationModuleService;
    private final WarehouseModuleService warehouseModuleService;
    private final FloorModuleService floorModuleService;
    private final ProductModuleService productModuleService;
    private final LocationRepository locationRepository;

    /**
     * 특정 로케이션 조회
     *
     * @param id: location id
     * @return id값과 일치하는 Location 하나, 없으면 null 리턴
     */
    public LocationResponseDto findById(Long id) throws FloorException {
        log.info("[Service] find Location by id: {}", id);
        Location location = locationModuleService.findById(id);
        return LocationMapper.toLocationResponseDto(location, getMaxFloorCapacity(location));
    }

    /**
     * 특정 창고가 가지고 있는 로케이션 전부 조회
     *
     * @param warehouseId: warehouse id
     * @return 입력 warehouseId를 가지고 있는 Location List
     */
    public List<LocationResponseDto> findAllByWarehouseId(Long warehouseId) throws FloorException {
        log.info("[Service] findAllLocation by warehouseId: {}", warehouseId);
        List<Location> locations = locationModuleService.findAllByWarehouseId(
            warehouseId);

        return locations.stream()
            .map(location -> LocationMapper.toLocationResponseDto(location,
                getMaxFloorCapacity(location)))
            .toList();
    }

    /**
     * location 정보 받아와서 DB에 저장하는 메서드 1.locationDto내부의 창고,저장타입 id를 통해 저장소에 조회해서 location에 담은 후 저장
     * 2.floorDto들을 floor객체로 바꿔주고 내부에 location정보 담아줌 3.floor객체들을 전부 저장하고 location에도 floor 객체정보 담아줌
     *
     * @param saveRequest : 프론트에서 넘어오는 location 정보 모든 작업이 하나의 트랜잭션에서 일어나야하므로 @Transactional 추가
     */
    @Transactional
    public void save(LocationSaveRequestDto saveRequest) {
        log.info("[Service] save Location");
        Warehouse warehouse = warehouseModuleService.findById(saveRequest.getWarehouseId());

        for (LocationRequestDto request : saveRequest.getRequests()) {

            Location location = LocationMapper.fromLocationRequestDto(request, warehouse);
            locationModuleService.save(location);
            floorModuleService.saveAllByLocation(request, location);
        }
    }


    /**
     * 창고의 타입에 맞게 floor의 타입을 수정 하는 기능
     *
     * @param floorRequestDto
     * @param warehouse       : 해당 floor에 해당하는 Warehouse, 타입 확인을 위함.
     * @return Floor : 타입이 반영된 Floor 객체
     */
    private void modifyExportType(FloorRequestDto floorRequestDto, Warehouse warehouse) {
        //warehouse가 STORE(매장)인 경우
        if (warehouse.getFacilityTypeEnum().equals(FacilityTypeEnum.STORE)) {
            floorRequestDto.setExportTypeEnum(ExportTypeEnum.STORE);
        }
    }

    /**
     * location 정보 수정 수정 가능한 정보는 이름과 좌표값들
     *
     * @param request: 바꿀 로케이션 정보들
     */
    @Transactional
    public LocationResponseDto update(Long id, LocationRequestDto request) throws FloorException {
        log.info("[Service] update Location by id: {}", id);
        Location location = locationModuleService.findById(id);

        if (request.getName() != null) {
            location.updateName(request.getName());
        }

        location.updatePosition(request.getXPosition(), request.getYPosition());

        Location savedLocation = locationModuleService.save(location);
        return LocationMapper.toLocationResponseDto(savedLocation,
            getMaxFloorCapacity(savedLocation));
    }

    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorModuleService.findAllByLocationId(location.getId());

        return floors.stream()
            .mapToInt(floorModuleService::getCapacity)
            .max()
            .orElse(0);
    }

    /**
     * location 삭제 -> id로 location을 조회하고 해당 location의 상태값을 DELETED로 변경 location내부의 모든 층도 상태값을
     * DELETED로 변경
     *
     * @param id: locationId
     */
    @Transactional
    public void delete(Long id) throws FloorException {
        log.info("[Service] delete Location by id: {}", id);
        Location location = locationModuleService.findById(id);

        List<Floor> floors = floorModuleService.findAllByLocationId(
            location.getId()); //location의 층 전부 조회

        floors.stream().forEach(
            floor -> floor.updateStatusEnum(StatusEnum.DELETED)
        );

        floorModuleService.saveAll(floors); //변경사항 저장
        locationModuleService.delete(location);
    }

    public Location findByNameAndWarehouseId(String locationName, Long warehouseId) {
        return locationRepository.findByNameAndWarehouseId(locationName,warehouseId);
    }

    /**
     * 모든 로케이션의 최대 적재 가능 수량 찾기
     * @return
     */
    public List<LocationStorageResponseDto> findAllMaxStorage() {
        return locationRepository.findAllMaxStorage().stream()
                .map(LocationMapper::toLocationStorageResponseDto)
                .toList();
    }
    public List<Location> findAllLocationByWarehouseId(Long warehouseId) {
        return locationRepository.findAllByWarehouseId(warehouseId);
    }
    public List<Location> findAllSortedByWarehouseId(Long warehouseId) {
        return locationRepository.findAllSortedByWarehouseId(warehouseId);
    }
}
