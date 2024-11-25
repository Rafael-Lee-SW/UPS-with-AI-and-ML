package com.a302.wms.domain.store.service;

import com.a302.wms.domain.device.dto.DeviceResponse;
import com.a302.wms.domain.device.mapper.DeviceMapper;
import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorServiceImpl;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.mapper.ProductMapper;
import com.a302.wms.domain.product.repository.ProductRepository;
import com.a302.wms.domain.store.dto.StoreCreateRequest;
import com.a302.wms.domain.store.dto.StoreDetailResponse;
import com.a302.wms.domain.store.dto.StoreResponse;
import com.a302.wms.domain.store.dto.StoreUpdateRequest;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.mapper.StoreMapper;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.structure.dto.StructureCreateRequest;
import com.a302.wms.domain.structure.dto.StructureDeleteRequest;
import com.a302.wms.domain.structure.dto.StructureUpdateRequest;
import com.a302.wms.domain.structure.dto.location.LocationListCreateRequest;
import com.a302.wms.domain.structure.dto.location.LocationResponse;
import com.a302.wms.domain.structure.dto.wall.WallListCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallResponse;
import com.a302.wms.domain.structure.entity.Location;
import com.a302.wms.domain.structure.mapper.LocationMapper;
import com.a302.wms.domain.structure.mapper.WallMapper;
import com.a302.wms.domain.structure.service.LocationServiceImpl;
import com.a302.wms.domain.structure.service.StructureServiceImpl;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.handler.CommonException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoreServiceImpl {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final FloorServiceImpl floorService;
    private final FloorRepository floorRepository;
    private final ProductRepository productRepository;
    private final StructureServiceImpl structureService;
    private final LocationServiceImpl locationServiceImpl;


    /**
     * 매장을 생성하는 메서드
     *
     * @param userId             : 생성할 매장의 userId
     * @param storeCreateRequest : 생성할 매장의 정보
     * @return : 생성한 매장의 정보
     */
    @Transactional
    public StoreResponse save(Long userId, StoreCreateRequest storeCreateRequest) {
        log.info("[Service] save store");

        User user = userRepository.findById(userId).orElseThrow();

        Store savedStore = storeRepository.save(StoreMapper.fromCreateRequestDto(storeCreateRequest, user));
        List<DeviceResponse> deviceResponseList = savedStore.getDevices().stream().map(DeviceMapper::toResponseDto).toList();
        StoreResponse response = StoreMapper.toResponseDto(savedStore, deviceResponseList);

        // 디폴트 로케이션 추가
        Location location = locationServiceImpl.saveDefaultLocation(savedStore);
        Floor floor = floorService.saveDefaultFloor(location);
        log.info("{}", response);

        return response;
    }

    /**
     * 매장 정보를 업데이트 하는 메서드
     *
     * @param userId
     * @param storeUpdateRequest
     * @return
     */
    public StoreResponse update(Long userId, StoreUpdateRequest storeUpdateRequest) {
        log.info("[Service] update store {}", storeUpdateRequest);
        User user = userRepository.findById(userId).orElseThrow();
        Store store = storeRepository.findById(storeUpdateRequest.storeId()).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));


        store.update(storeUpdateRequest);
        Store updatedStore = storeRepository.save(store);
        List<DeviceResponse> deviceResponseList = updatedStore.getDevices().stream().map(DeviceMapper::toResponseDto).toList();

        return StoreMapper.toResponseDto(updatedStore, deviceResponseList);
    }

    /**
     * userId에 해당하는 모든 매장 정보를 조회
     *
     * @param userId : 조회할 매장의 정보
     * @return : userId에 해당하는 모든 매장의 리스트
     */
    public List<StoreResponse> findByUserId(Long userId) {
        log.info("[Service] find stores by userId");

        return storeRepository.findAllByUserId(userId)
                .stream()
                .map(store -> {
                    List<DeviceResponse> deviceResponses = store.getDevices().stream().map(DeviceMapper::toResponseDto).toList();
                    return StoreMapper.toResponseDto(store, deviceResponses);
                })
                .toList();
    }

    public StoreResponse findById(Long storeId) {
        log.info("[Service] find store");
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "매장을 찾을 수 없습니다."));
        List<DeviceResponse> deviceResponses = store.getDevices().stream().map(DeviceMapper::toResponseDto).toList();
        return StoreMapper.toResponseDto(store, deviceResponses);
    }

    /**
     * 매장의 세부 정보를 조회
     *
     * @param userId  : 조회할 매장의 userId
     * @param storeId : 조회할 매장의 storeId
     * @return : userId, StoreId에 해당하는 매장의 세부 정보
     */
    @Transactional
    public StoreDetailResponse findStoreDetailedInfo(Long userId, Long storeId) {
        log.info("[Service] find store:");
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));
        if (!Objects.equals(store.getUser().getId(), userId))
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        List<LocationResponse> locationList = store.getLocations().stream()
                .map(location ->
                        LocationMapper.toLocationResponseDto(location, getMaxFloorCapacity(location))
                ).toList();
        List<WallResponse> wallList = store.getWalls().stream()
                .map(WallMapper::toResponseDto).toList();

        return StoreMapper.toDetailResponseDto(store, locationList, wallList);
    }


    /**
     * 특정 매장 삭제
     *
     * @param userId  : 삭제할 매장의 userId
     * @param storeId : 삭제할 매장의 storeId
     */
    @Transactional
    public void delete(Long userId, Long storeId) {
        log.info("[Service] delete store by id");
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));
        if (!Objects.equals(store.getUser().getId(), userId))
            throw new CommonException(ResponseEnum.BAD_REQUEST, "매장에 대한 권한이 없습니다.");
        storeRepository.delete(store);
    }

    /**
     * 매장 구조 생성
     *
     * @param userId
     * @param storeId
     * @param structureCreateRequest
     */
    public void saveStructure(Long userId, Long storeId, StructureCreateRequest structureCreateRequest) {
        log.info("[Service] save store structure");
        Store store = storeRepository.findById(storeId).orElseThrow();

        structureService.saveStructure(userId, storeId, structureCreateRequest);
        Store savedStore = storeRepository.save(store);
    }

    /**
     * 매장 구조 수정
     *
     * @param userId
     * @param storeId
     * @param structureUpdateRequest
     */
    public StoreDetailResponse updateStructure(Long userId, Long storeId, StructureUpdateRequest structureUpdateRequest) {
        log.info("[Service] update store structure");
        Store store = storeRepository.findById(storeId).orElseThrow();

        return structureService.updateStructure(userId, storeId, structureUpdateRequest);
    }

    /**
     * 매장 구조 삭제
     *
     * @param userId
     * @param storeId
     * @param structureDeleteRequest
     */
    public void deleteStructure(Long userId, Long storeId, StructureDeleteRequest structureDeleteRequest) {
        log.info("[Service] delete store structure");
        Store store = storeRepository.findById(storeId).orElseThrow();

        structureService.deleteStructure(userId, storeId, structureDeleteRequest);
    }

    /**
     * 모든 location을 해당 storeId의 매장에 저장하는 메서드
     *
     * @param userId
     * @param locationListCreateRequest
     */
    public void saveAllLocations(Long userId, LocationListCreateRequest locationListCreateRequest) {
        log.info("[Service] save all location");
        User user = userRepository.findById(userId).orElseThrow();
        Store store = storeRepository.findById(locationListCreateRequest.storeId()).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));


        structureService.saveAllLocations(userId, locationListCreateRequest.storeId(), locationListCreateRequest.requests());
    }

    /**
     * 모든 wall을 해당 storeid의 매장에 저장하는 메서드
     *
     * @param wallListCreateRequest
     */
    public void saveAllWall(Long userId, WallListCreateRequest wallListCreateRequest) {
        log.info("[Service] save all walls by storeId");
        User user = userRepository.findById(userId).orElseThrow(() -> new CommonException(ResponseEnum.USER_NOT_FOUND, "일치하는 사용자를 찾을 수 없습니다."));
        Store store = storeRepository.findById(wallListCreateRequest.storeId()).orElseThrow(() -> new CommonException(ResponseEnum.STORE_NOT_FOUND, "해당 매장을 찾을 수 없습니다."));
        if (!Objects.equals(store.getUser().getId(), user.getId()))
            throw new CommonException(ResponseEnum.BAD_REQUEST, "해당 매장에 대한 권한이 없습니다.");

        structureService.saveAllWalls(userId, wallListCreateRequest.storeId(), wallListCreateRequest.wallCreateDtos());
    }

    /**
     * 해당 매장에 있는 product를 모두 조회하는 메서드
     *
     * @param storeId
     * @return
     */
    public List<ProductResponse> findProducts(Long storeId) {
        log.info("[Service] get all the products of the store: {}", storeId);
        return productRepository.findByStoreId(storeId).stream()
                .map(ProductMapper::toProductResponse)
                .toList();
    }

    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorRepository.findAllByLocationId(location.getId());

        return floors.stream()
                .mapToInt(floorService::getCapacity)
                .max()
                .orElse(0);
    }
}
