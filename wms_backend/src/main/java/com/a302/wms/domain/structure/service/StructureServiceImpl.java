package com.a302.wms.domain.structure.service;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorServiceImpl;
import com.a302.wms.domain.store.entity.Store;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class StructureServiceImpl {

    private final WallRepository wallRepository;
    private final LocationRepository locationRepository;
    private final FloorRepository floorRepository;
    private final FloorServiceImpl floorService;
    private final LocationServiceImpl locationServiceImpl;
    private final StoreRepository storeRepository;


//    public List<LocationResponse> findLocationsByStoreId(Long storeId) throws FloorException {
//        return locationServiceImpl.findAllByStoreId(storeId);
//    }

//    public List<WallResponse> findWallsByStoreId(Long storeId) {
//        return wallRepository.findByStoreId(storeId)
//                .stream()
//                .map(WallMapper::toResponseDto)
//                .toList();
//    }

    /**
     * Floor의 최대 적재 가능 개수를 반환
     *
     * @param location : Floor가 있는 location의 정보
     * @return : 최대 적재 가능 개수
     */
//    private int getMaxFloorCapacity(Location location) {
//        List<Floor> floors = floorRepository.findAllByLocationId(location.getId());
//
//        return floors.stream()
//                .mapToInt(floorService::getCapacity)
//                .max()
//                .orElse(0);
//    }
    public void saveStructure(Long userId, Long storeId, StructureCreateRequest structureCreateRequest) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null) {
        }
        if (store.getUser().getId() != userId) {
        }

        saveWalls(store, structureCreateRequest.wallCreateRequestList());
        saveLocations(store, structureCreateRequest.locationCreateRequestList());
    }

    public void saveAllLocations(Long userId, Long storeId, List<LocationCreateRequest> locationCreateRequestList) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null) {
        }
        if (store.getUser().getId() != userId) {
        }

        saveLocations(store, locationCreateRequestList);
    }

    public void saveAllWalls(Long userId, Long storeId, List<WallCreateRequest> wallCreateRequestList) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null) {
        }
        if (store.getUser().getId() != userId) {
        }

        saveWalls(store, wallCreateRequestList);
    }

    private void saveLocations(Store store, List<LocationCreateRequest> locationCreateRequestList) {
        List<Location> locationList = locationCreateRequestList.stream()
                .map(locationCreateRequest -> LocationMapper.fromLocationRequestDto(locationCreateRequest, store))
                .toList();
        store.getLocations().addAll(locationList);
        locationRepository.saveAll(locationList);
    }


    private void saveWalls(Store store, List<WallCreateRequest> wallCreateRequestList) {
        List<Wall> wallList = wallCreateRequestList.stream()
                .map(wallCreateDto ->
                        WallMapper.fromCreateRequestDto(wallCreateDto, store)
                )
                .toList();
        store.getWalls().addAll(wallList);
        wallRepository.saveAll(wallList);
    }

    public void updateStructure(Long userId, Long storeId, StructureUpdateRequest structureUpdateRequest) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null) {
        }
        if (store.getUser().getId() != userId) {
        }

        List<LocationResponse> locationResponseList = updateAllLocations(store, structureUpdateRequest.locationUpdateRequestList());
        List<WallResponse> wallResponseList = updateAllWalls(store, structureUpdateRequest.wallUpdateRequestList());

    }

    public List<WallResponse> updateWalls(Long userId, Long storeId, List<WallUpdateRequest> wallUpdateRequestList) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null) {
        }
        if (store.getUser().getId() != userId) {
        }

        return updateAllWalls(store, wallUpdateRequestList);
    }

    public List<LocationResponse> updateLocations(Long userId, Long storeId, List<LocationUpdateRequest> locationUpdateRequestList) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null) {
        }
        if (store.getUser().getId() != userId) {
        }

        return updateAllLocations(store, locationUpdateRequestList);
    }

    private List<LocationResponse> updateAllLocations(Store store, List<LocationUpdateRequest> locationUpdateRequestList) {
        List<LocationResponse> locationResponseList = locationUpdateRequestList.stream()
                .map(request -> {
                    Location location = locationRepository.findById(request.getId()).orElse(null);
                    if (location == null) {
                    }
                    if (!Objects.equals(location.getStore().getId(), store.getId())) {
                    }
//                    location.updateFloors(locationUpdateRequest.floors);
                    location.updateSize(request.getXSize(), request.getYSize(), request.getZSize());
                    location.updateName(request.getName());
                    location.updatePosition(request.getXPosition(), request.getYPosition());
                    return location;
                })
                .map(locationRepository::save)
                .map(location -> LocationMapper.toLocationResponseDto(location,
                        getMaxFloorCapacity(location)))
                .toList();
        return locationResponseList;
    }

    private List<WallResponse> updateAllWalls(Store store, List<WallUpdateRequest> wallUpdateRequestList) {
        List<WallResponse> wallResponseList = wallUpdateRequestList.stream()
                .map(request -> {
                    Wall wall = wallRepository.findById(request.id()).orElse(null);
                    if (wall == null) {
                    }
                    if (!Objects.equals(wall.getStore().getId(), store.getId())) {
                    }
                    wall.updateFromDto(request);
                    return wall;
                })
                .map(wallRepository::save)
                .map(WallMapper::toResponseDto)
                .toList();
        return wallResponseList;
    }

    public void deleteStructure(Long userId, Long storeId, StructureDeleteRequest structureDeleteRequest) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null) {
        }
        if (store.getUser().getId() != userId) {
        }

        structureDeleteRequest.locationDeleteList().forEach(locationId -> {
            Location location = locationRepository.findById(locationId).orElse(null);
            if (location == null) {
            }
            if (!Objects.equals(location.getStore().getId(), store.getId())) {
            }

            store.getLocations().remove(location);
            locationRepository.deleteById(locationId);
        });

        structureDeleteRequest.wallDeleteList().forEach(wallId -> {
            Wall wall = wallRepository.findById(wallId).orElse(null);
            if (wall == null) {
            }
            if (!Objects.equals(wall.getStore().getId(), store.getId())) {
            }

            store.getWalls().remove(wall);
            wallRepository.deleteById(wallId);
        });
    }


    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorRepository.findAllByLocationId(location.getId());

        return floors.stream()
                .mapToInt(floorService::getCapacity)
                .max()
                .orElse(0);
    }

}
