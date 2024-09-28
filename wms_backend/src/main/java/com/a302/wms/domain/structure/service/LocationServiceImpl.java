package com.a302.wms.domain.structure.service;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.exception.FloorException;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorServiceImpl;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.structure.dto.location.LocationCreateRequest;
import com.a302.wms.domain.structure.dto.location.LocationListCreateRequest;
import com.a302.wms.domain.structure.dto.location.LocationResponse;
import com.a302.wms.domain.structure.dto.location.LocationStorageResponse;
import com.a302.wms.domain.structure.entity.Location;
import com.a302.wms.domain.structure.mapper.LocationMapper;
import com.a302.wms.domain.structure.repository.LocationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationServiceImpl {
    private final FloorServiceImpl floorService;
    private final LocationRepository locationRepository;
    private final FloorRepository floorRepository;
    private final StoreRepository storeRepository;

    /**
     * 모든 로케이션 반환
     *
     * @return 모든 로케이션
     */
    public List<Location> findAll() {
        return locationRepository.findAll();
    }


    public boolean notExist(Long id) {
        return !locationRepository.existsById(id);
    }

    /**
     * 특정 로케이션 조회
     *
     * @param id: location productId
     * @return id값과 일치하는 Location 하나, 없으면 null 리턴
     */
    public LocationResponse findById(Long id) throws FloorException {
        log.info("[Service] find Location by productId");
        Location location = locationRepository.findById(id).orElse(null);
        return LocationMapper.toLocationResponseDto(location, getMaxFloorCapacity(location));
    }

    /**
     * 특정 매장이 가지고 있는 로케이션 전부 조회
     *
     * @param storeId: store productId
     * @return 입력 storeId를 가지고 있는 Location List
     */
    public List<LocationResponse> findAllByStoreId(Long storeId) throws FloorException {
        log.info("[Service] findAllLocation by storeId");

        List<LocationResponse> locationResponses = new ArrayList<>();
        locationRepository.findAllByStoreId(storeId).stream()
                .map(location -> locationResponses.add(LocationMapper.toLocationResponseDto(location, getMaxFloorCapacity(location))));
        return locationResponses;
    }

    /**
     * location 정보 받아와서 DB에 저장하는 메서드 1.locationDto내부의 매장,저장타입 id를 통해 저장소에 조회해서 location에 담은 후 저장
     * 2.floorDto들을 floor객체로 바꿔주고 내부에 location정보 담아줌 3.floor객체들을 전부 저장하고 location에도 floor 객체정보 담아줌
     *
     * @param saveRequest : 프론트에서 넘어오는 location 정보 모든 작업이 하나의 트랜잭션에서 일어나야하므로 @Transactional 추가
     */
    @Transactional
    public void save(LocationListCreateRequest saveRequest) throws FloorException {
        log.info("[Service] save Location");
//        Store store = storeRepository.findById(saveRequest.getStoreId()).get();
//
//        for (LocationRequestDto request : saveRequest.getRequests()) {
//
//            Location location = LocationMapper.fromLocationRequestDto(request, store);
//            locationRepository.save(location);
//            floorService.saveAllByLocation(request, location);
//        }
    }

    /**
     * location 정보 수정 수정 가능한 정보는 이름과 좌표값들
     *
     * @param request: 바꿀 로케이션 정보들
     */
    @Transactional
    public LocationResponse update(Long id, LocationCreateRequest request) throws FloorException {
        log.info("[Service] update Location by productId");
        Location location = locationRepository.findById(id).get();

        if (request.getName() != null) {
            location.updateName(request.getName());
        }

        location.updatePosition(request.getXPosition(), request.getYPosition());

        Location savedLocation = locationRepository.save(location);
        return LocationMapper.toLocationResponseDto(savedLocation,
                getMaxFloorCapacity(savedLocation));
    }

    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorRepository.findAllByLocationId(location.getId());

        return floors.stream()
                .mapToInt(floorService::getCapacity)
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
        log.info("[Service] delete Location by productId");
        Location location = locationRepository.findById(id).get();

        List<Floor> floors = floorRepository.findAllByLocationId(
                location.getId()); //location의 층 전부 조회

        floorService.deleteAll(floors); //변경사항 저장
        locationRepository.delete(location);
    }

    public Location findByNameAndStoreId(String locationName, Long storeId) {
        return locationRepository.findByNameAndStoreId(locationName, storeId);
    }

    /**
     * 모든 로케이션의 최대 적재 가능 수량 찾기
     *
     * @return
     */
    public List<LocationStorageResponse> findAllMaxStorage() {
        return locationRepository.findAllMaxStorage().stream()
                .map(LocationMapper::toLocationStorageResponseDto)
                .toList();
    }
}
