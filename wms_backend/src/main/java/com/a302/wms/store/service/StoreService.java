package com.a302.wms.store.service;

import com.a302.wms.floor.entity.Floor;
import com.a302.wms.floor.exception.FloorException;
import com.a302.wms.floor.repository.FloorRepository;
import com.a302.wms.floor.service.FloorService;
import com.a302.wms.location.dto.LocationResponseDto;
import com.a302.wms.location.entity.Location;
import com.a302.wms.location.mapper.LocationMapper;
import com.a302.wms.location.repository.LocationRepository;
import com.a302.wms.location.service.LocationService;
import com.a302.wms.product.service.ProductService;
import com.a302.wms.store.dto.*;
import com.a302.wms.store.entity.Store;
import com.a302.wms.store.mapper.StoreMapper;
import com.a302.wms.store.mapper.WallMapper;
import com.a302.wms.store.repository.StoreRepository;
import com.a302.wms.user.entity.User;
import com.a302.wms.user.repository.UserRepository;
import com.a302.wms.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoreService {

    private final UserService userService;
    private final LocationService locationService;
    private final WallService wallService;
    private final StoreRepository warehouseRepository;
    private final ProductService productService;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final LocationRepository locationRepository;
    private final FloorService floorService;
    private final FloorRepository floorRepository;


    public Store save(Store store) {
        return warehouseRepository.save(store);
    }

    /*
   매장를 비활성화하는 메서드 (상태를 DELETED로 설정, PATCH)
    */
    @Transactional
    public void delete(Store store) {
        storeRepository.delete(store);

    }

    public boolean notExist(Long storeId) {
        return !warehouseRepository.existsById(storeId);
    }

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
        storeRepository.save(store);
        Location defaultLocation = Location.builder()
                .store(store)
                .build();
        locationRepository.save(defaultLocation);

        Floor defaultFloor = Floor.builder()
                .location(defaultLocation)
                .floorLevel(-1)
                .build();
        floorService.save(defaultFloor);

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
        List<Store> warehouses = storeRepository.findByUserId(userId); // 매장 목록 조회

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
    public StoreDetailResponseDto findById(Long id) throws FloorException {
        log.info("[Service] find Store with productId {}", id);
        Store store = storeRepository.findById(id).get();

        List<LocationResponseDto> locations = locationRepository.findAllByStoreId(
                        id)
                .stream()
                .map(location -> LocationMapper.toLocationResponseDto(location,
                        getMaxFloorCapacity(location)))
                .toList();

        List<WallDto> walls = wallService.findByStoreId(id)
                .stream()
                .map(WallMapper::toWallDto)
                .toList();

        return StoreMapper.toStoreDetailResponseDto(store, locations, walls);
    }

    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorRepository.findAllByLocationId(location.getId());

        return floors.stream()
                .mapToInt(floorService::getCapacity)
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
        storeRepository.deleteById(id);
    }

    private int calculateRowCount(int size) {
        double sizeInSquareMeters = size * 3.305785; // 평을 제곱미터로 변환
        return (int) Math.sqrt(sizeInSquareMeters); // 제곱근 계산
    }

    private Store createStore(StoreRequestDto warehouseDto) /*throws StoreException */ {

        User user = userRepository.findById(warehouseDto.getUserId()).get();


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
                .build();
    }

    public void saveAllWall(WallRequestDto saveRequest) {
        log.info("[Service] save All Wall");
        Store store = storeRepository.findById(saveRequest.getStoreId()).get();
        for (WallDto request : saveRequest.getWallDtos()) {
            wallService.save(WallMapper.fromDto(request, store));
        }
    }


    public int findLocationCnt(Long id) throws FloorException {
        List<Location> locations = locationRepository.findAllByStoreId(id);
        return locations.stream()
                .filter(location -> location.getZSize() > 0)
                .mapToInt(Location::getZSize)
                .sum();
    }

    public int findUsage(Long id) {
        List<Location> locations = locationRepository.findAllByStoreId(id);
        List<Floor> floors = floorService.findAllNotEmptyFloorByStoreId(id);

        int totalCnt = locations.stream()
                .filter(location -> location.getZSize() > 0)
                .mapToInt(Location::getZSize)
                .sum();

        if (totalCnt == 0) {
            return 0;
        }

        return Math.max(1, floors.size() * 100 / totalCnt);
    }

}
