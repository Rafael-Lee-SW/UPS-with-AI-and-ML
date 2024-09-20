package com.a302.wms.store.service;

import com.a302.wms.floor.entity.Floor;
import com.a302.wms.floor.service.FloorModuleService;
import com.a302.wms.location.dto.LocationResponseDto;
import com.a302.wms.location.entity.Location;
import com.a302.wms.location.mapper.LocationMapper;
import com.a302.wms.location.service.LocationModuleService;
import com.a302.wms.product.service.ProductService;
import com.a302.wms.store.dto.*;
import com.a302.wms.store.entity.Store;
import com.a302.wms.store.mapper.StoreMapper;
import com.a302.wms.store.mapper.WallMapper;
import com.a302.wms.store.repository.StoreRepository;
import com.a302.wms.user.entity.User;
import com.a302.wms.user.service.UserModuleService;
import com.a302.wms.util.constant.ExportTypeEnum;
import com.a302.wms.util.constant.FacilityTypeEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreMoudleService storeMoudleService;
    private final UserModuleService userModuleService;
    private final LocationModuleService locationModuleService;
    private final FloorModuleService floorModuleService;
    private final WallModuleService wallModuleService;
    private final StoreRepository warehouseRepository;
    private final ProductService productService;

    /**
     * 최초 매장를 생성하는 메서드
     *
     * @param warehouseDto
     * @return
     */
    @Transactional
    public StoreRequestDto save(StoreRequestDto warehouseDto) {
        log.info("[Service] save Store");
        Store store = createStore(warehouseDto);
        store = storeMoudleService.save(store);
        Location defaultLocation = Location.builder()
            .store(store)
            .build();
        locationModuleService.save(defaultLocation);

        Floor defaultFloor = Floor.builder()
            .location(defaultLocation)
            .exportTypeEnum(ExportTypeEnum.IMPORT)
            .floorLevel(-1)
            .build();
        floorModuleService.save(defaultFloor);

        return StoreMapper.fromStore(store);
    }

    /**
     * 비지니스 id로 매장 목록을 조회하는 메서드
     *
     * @param userId
     * @return
     */
    public List<StoreByUserDto> findByUserId(Long userId) {
        log.info("[Service] find Stores with user productId {}", userId);
        List<Store> warehouses = storeMoudleService.findByUserId(
            userId); // 매장 목록 조회

        return warehouses.stream()
            .map(StoreMapper::toStoreByUserDto)
            .toList();
    }

    /**
     * 매장 id로 매장를 조회하는 메서드
     *
     * @param id
     * @return
     */
    @Transactional
    public StoreDetailResponseDto findById(Long id) {
        log.info("[Service] find Store with productId {}", id);
        Store store = storeMoudleService.findById(id);

        List<LocationResponseDto> locations = locationModuleService.findAllByStoreId(
                id)
            .stream()
            .map(location -> LocationMapper.toLocationResponseDto(location,
                getMaxFloorCapacity(location)))
            .toList();

        List<WallDto> walls = wallModuleService.findByStoreId(id)
            .stream()
            .map(WallMapper::toWallDto)
            .toList();

        return StoreMapper.toStoreDetailResponseDto(store, locations, walls);
    }

    /**
     * 프론트에 랜더링 되는 Location과 Wall의 정보를 수정하는 메서드
     *
     * @param id
     * @param request
     * @return
     */
    @Transactional
    public StoreDetailResponseDto updateLocationsAndWalls(
        Long id, LocationsAndWallsRequestDto request) {
        log.info("[Service] update Store Locations And Walls by productId: {}", id);
        Store store = storeMoudleService.findById(id);

        List<LocationResponseDto> locations = request.getLocations().stream()
            .map(location -> LocationMapper.fromLocationUpdateDto(location, store))
            .map(locationModuleService::save)
            .map(location -> LocationMapper.toLocationResponseDto(location,
                getMaxFloorCapacity(location)))
            .toList();

        List<WallDto> walls = request.getWalls().stream()
            .map(wall -> WallMapper.fromDto(wall, store))
            .map(wallModuleService::save)
            .map(WallMapper::toWallDto)
            .toList();

        return StoreMapper.toStoreDetailResponseDto(store, locations, walls);
    }

    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorModuleService.findAllByLocationId(location.getId());

        return floors.stream()
            .mapToInt(floorModuleService::getCapacity)
            .max()
            .orElse(0);
    }

    /**
     * 매장를 삭제하는 메서드 (상태 값을 DELETED로 변경)
     *
     * @param id
     */
    @Transactional
    public void delete(Long id) {
        log.info("[Service] delete Store by productId: {}", id);
        Store store = storeMoudleService.findById(id);
        storeMoudleService.delete(store);
    }

    private int calculateRowCount(int size) {
        double sizeInSquareMeters = size * 3.305785; // 평을 제곱미터로 변환
        return (int) Math.sqrt(sizeInSquareMeters); // 제곱근 계산
    }

    private Store createStore(StoreRequestDto warehouseDto) /*throws StoreException */ {

        User user = userModuleService.findById(warehouseDto.getUserId());

//        if(user == null)
//            throw new StoreException.UserNotFoundException("userId가 올바르지 않습니다.",ResponseEnum.BAD_REQUEST);
//        if (warehouseDto.getSize() <= 0) {
//            throw new StoreException.InvalidInputException("유효하지 않은 매장 크기입니다.", ResponseEnum.BAD_REQUEST);
//        }
//        if (warehouseDto.getName() == null || warehouseDto.getName().trim().isEmpty()) {
//            throw new StoreException.InvalidInputException("매장 이름이 입력되지 않았습니다.", ResponseEnum.BAD_REQUEST);
//        }
//        if (warehouseDto.getPriority() == 0) {
//            throw new StoreException.InvalidInputException("매장 우선순위가 입력되지 않았습니다.", ResponseEnum.BAD_REQUEST);
//        }
//        if (warehouseDto.getFacilityTypeEnum() == null) {
//            throw new StoreException.InvalidInputException("매장 유형이 입력되지 않았습니다.", ResponseEnum.BAD_REQUEST);
//        }

        //수직 배치수 수평 배치수 계산
        int rowCnt = calculateRowCount(warehouseDto.getSize());
        //수직 배치수 수평 배치수 계산
        int columnCnt = calculateRowCount(warehouseDto.getSize());
        return Store.builder()
            .user(user)
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
        Store store = storeMoudleService.findById(saveRequest.getStoreId());
        for (WallDto request : saveRequest.getWallDtos()) {
            wallModuleService.save(WallMapper.fromDto(request, store));
        }
    }

    public int findStoreCntByUserId(Long userId) {
        // 실제 로직을 여기에 구현합니다.
        // 예를 들어, 레포지토리를 사용하여 비즈니스 ID에 해당하는 매장 수를 조회합니다.
        return warehouseRepository.countByUserId(userId);
    }


    public int findLocationCnt(Long id) {
        List<Location> locations = locationModuleService.findAllByStoreId(id);
        return locations.stream()
            .filter(location -> location.getZSize() > 0)
            .mapToInt(Location::getZSize)
            .sum();
    }

    public int findUsage(Long id) {
        List<Location> locations = locationModuleService.findAllByStoreId(id);
        List<Floor> floors = floorModuleService.findAllNotEmptyFloorByStoreId(id);

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
        Store store = storeMoudleService.findById(id);

        if (store.getFacilityTypeEnum() == FacilityTypeEnum.STORE) {
            return 1;
        } else if (store.getPriority() == 1) {
            return 2;
        }

        return 3;
    }

}
