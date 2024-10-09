package com.a302.wms.domain.structure.service;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorServiceImpl;
import com.a302.wms.domain.store.dto.StoreDetailResponse;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.mapper.StoreMapper;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.structure.dto.StructureCreateRequest;
import com.a302.wms.domain.structure.dto.StructureDeleteRequest;
import com.a302.wms.domain.structure.dto.StructureUpdateRequest;
import com.a302.wms.domain.structure.dto.location.LocationCreateRequest;
import com.a302.wms.domain.structure.dto.location.LocationResponse;
import com.a302.wms.domain.structure.dto.location.LocationUpdateRequest;
import com.a302.wms.domain.structure.dto.wall.WallCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallResponse;
import com.a302.wms.domain.structure.dto.wall.WallUpdateRequest;
import com.a302.wms.domain.structure.entity.Location;
import com.a302.wms.domain.structure.entity.Wall;
import com.a302.wms.domain.structure.mapper.LocationMapper;
import com.a302.wms.domain.structure.mapper.WallMapper;
import com.a302.wms.domain.structure.repository.LocationRepository;
import com.a302.wms.domain.structure.repository.WallRepository;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.handler.CommonException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.a302.wms.global.constant.ProductConstant.DEFAULT_FLOOR_LEVEL;

@Service
@RequiredArgsConstructor
@Slf4j
public class StructureServiceImpl {

    private final WallRepository wallRepository;
    private final LocationRepository locationRepository;
    private final FloorRepository floorRepository;
    private final FloorServiceImpl floorService;
    private final StoreRepository storeRepository;


    /**
     * Floor의 최대 적재 가능 개수를 반환
     *
     * @param location : Floor가 있는 location의 정보
     * @return : 최대 적재 가능 개수
     */
    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorRepository.findAllByLocationId(location.getId());

        return floors.stream()
                .mapToInt(floorService::getCapacity)
                .max()
                .orElse(0);
    }

    public void saveStructure(Long userId, Long storeId, StructureCreateRequest structureCreateRequest) {
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));
        if (!Objects.equals(store.getUser().getId(), userId)) {
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        }

        saveWalls(store, structureCreateRequest.wallCreateRequestList());
        saveLocations(store, structureCreateRequest.locationCreateRequestList());
    }

    public void saveAllLocations(Long userId, Long storeId, List<LocationCreateRequest> locationCreateRequestList) {
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));

        if (!Objects.equals(store.getUser().getId(), userId)) {
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        }

        saveLocations(store, locationCreateRequestList);
    }

    public void saveAllWalls(Long userId, Long storeId, List<WallCreateRequest> wallCreateRequestList) {
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));

        if (!Objects.equals(store.getUser().getId(), userId)) {
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        }

        saveWalls(store, wallCreateRequestList);
    }

    @Transactional
    protected void saveLocations(Store store, List<LocationCreateRequest> locationCreateRequestList) {
        List<Location> locationList = locationCreateRequestList.stream()
                .map(request -> {
                    Location location = LocationMapper.fromLocationRequestDto(request, store, new ArrayList<>());
                    List<Floor> locationFloorList = location.getFloorList();
                    if (location.getZSize() == DEFAULT_FLOOR_LEVEL) {
                        locationFloorList.add(floorService.buildDefaultFloor(location));
                    }
                    for (int floorLevel = 1; floorLevel <= location.getZSize(); floorLevel++) {
                        locationFloorList.add(floorService.buildOtherFloor(location, floorLevel));
                    }
                    return location;
                }).toList();
        store.getLocations().addAll(locationList);
        storeRepository.save(store);
    }


    @Transactional
    protected void saveWalls(Store store, List<WallCreateRequest> wallCreateRequestList) {
        List<Wall> wallList = wallCreateRequestList.stream()
                .map(wallCreateDto ->
                        WallMapper.fromCreateRequestDto(wallCreateDto, store)
                )
                .toList();
        store.getWalls().addAll(wallList);
        wallRepository.saveAll(wallList);
    }

    public StoreDetailResponse updateStructure(Long userId, Long storeId, StructureUpdateRequest structureUpdateRequest) {
        log.info("[Service] update structure of the store {}", storeId);
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));
        if (!Objects.equals(store.getUser().getId(), userId)) {
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        }

        List<LocationResponse> locationResponseList = updateAllLocations(store, structureUpdateRequest.locationUpdateRequestList());
        List<WallResponse> wallResponseList = updateAllWalls(store, structureUpdateRequest.wallUpdateRequestList());
        return StoreMapper.toDetailResponseDto(store, locationResponseList, wallResponseList);
    }

    public List<WallResponse> updateWalls(Long userId, Long storeId, List<WallUpdateRequest> wallUpdateRequestList) {
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));

        if (!Objects.equals(store.getUser().getId(), userId)) {
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        }
        return updateAllWalls(store, wallUpdateRequestList);
    }

    public List<LocationResponse> updateLocations(Long userId, Long storeId, List<LocationUpdateRequest> locationUpdateRequestList) {
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));

        if (!Objects.equals(store.getUser().getId(), userId)) {
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        }

        return updateAllLocations(store, locationUpdateRequestList);
    }

    private List<LocationResponse> updateAllLocations(Store store, List<LocationUpdateRequest> locationUpdateRequestList) {
        List<Location> locationList = locationUpdateRequestList.stream()
                .map(request -> {
                    log.info("update location request: {}", request.getId());
                    Location location = locationRepository.findById(request.getId()).orElse(null);
                    if (location == null) {
                        throw new CommonException(ResponseEnum.LOCATION_NOT_FOUND, "수정할 로케이션 정보를 찾을 수 없습니다.");
                    }
                    if (!Objects.equals(location.getStore().getId(), store.getId())) {
                        log.info("id check: {}, {}", location.getStore().getId(), store.getId());
                        throw new CommonException(ResponseEnum.BAD_REQUEST, "해당 로케이션을 수정할 권한이 없습니다.");
                    }
//                    location.updateFloors(locationUpdateRequest.floors);
                    location.updateSize(request.getXSize(), request.getYSize(), request.getZSize());
                    location.updateName(request.getName());
                    location.updatePosition(request.getXPosition(), request.getYPosition());
                    return location;
                }).toList();
        List<Location> savedLocationList = locationRepository.saveAll(locationList);
        return savedLocationList.stream().map(location -> LocationMapper.toLocationResponseDto(location,
                        getMaxFloorCapacity(location)))
                .toList();
    }

    private List<WallResponse> updateAllWalls(Store store, List<WallUpdateRequest> wallUpdateRequestList) {
        List<Wall> wallList = wallUpdateRequestList.stream()
                .map(request -> {
                    Wall wall = wallRepository.findById(request.id()).orElse(null);
                    if (wall == null) {
                        throw new CommonException(ResponseEnum.WALL_NOT_FOUND, "수정할 벽 정보를 찾을 수 없습니다.");
                    }
                    if (!Objects.equals(wall.getStore().getId(), store.getId())) {
                        throw new CommonException(ResponseEnum.BAD_REQUEST, "해당 벽을 수정할 권한이 없습니다.");
                    }
                    wall.updateFromDto(request);
                    return wall;
                }).toList();
        List<Wall> savedWallList = wallRepository.saveAll(wallList);
        return savedWallList.stream().map(wallRepository::save)
                .map(WallMapper::toResponseDto)
                .toList();
    }

    public void deleteStructure(Long userId, Long storeId, StructureDeleteRequest structureDeleteRequest) {
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));
        if (!Objects.equals(store.getUser().getId(), userId)) {
            log.error("{} 유저는 {} 매장에 대한 권한이 없습니다.", userId, storeId);
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        }

        deleteLocations(storeId, structureDeleteRequest.locationDeleteList());
        deleteWalls(storeId, structureDeleteRequest.wallDeleteList());
    }

    protected void deleteLocations(Long storeId, List<Long> locationIdList) {
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "매장을 찾을 수 없습니다."));
        Floor defaultFloor = floorService.findDefaultFloorByStore(storeId);
        locationIdList.forEach(locationId -> {
            Location location = locationRepository.findById(locationId).orElse(null);
            if (location == null) {
                return;
            }
            if (!Objects.equals(location.getStore().getId(), storeId)) {
                log.error("해당 로케이션에 대한 권한이 없습니다.");
                throw new CommonException(ResponseEnum.BAD_REQUEST, "해당 로케이션에 대한 권한이 없습니다.");
            }

            //location 삭제 시 해당 위치의 상품을 default floor로 옮기는 로직 추가
            location.getFloorList().forEach(floor -> {
                defaultFloor.getProductList().addAll(floor.getProductList());
            });
            locationRepository.delete(location);
        });
    }

    protected void deleteWalls(Long storeId, List<Long> wallIdList) {
        wallIdList.forEach(wallId -> {
            Wall wall = wallRepository.findById(wallId).orElse(null);
            if (wall == null) {
                return;
            }
            if (!Objects.equals(wall.getStore().getId(), storeId)) {
                log.error("해당 벽에 대한 권한이 없습니다.");
                throw new CommonException(ResponseEnum.BAD_REQUEST, "해당 벽에 대한 권한이 없습니다.");
            }
            wallRepository.delete(wall);
        });
    }


}
