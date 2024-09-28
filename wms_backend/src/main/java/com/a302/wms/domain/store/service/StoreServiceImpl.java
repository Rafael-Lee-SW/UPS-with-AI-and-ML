package com.a302.wms.domain.store.service;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorServiceImpl;
import com.a302.wms.domain.store.dto.StoreUpdateRequest;
import com.a302.wms.domain.structure.dto.StructureCreateRequest;
import com.a302.wms.domain.structure.dto.StructureDeleteRequest;
import com.a302.wms.domain.structure.dto.StructureUpdateRequest;
import com.a302.wms.domain.structure.dto.location.LocationListCreateRequest;
import com.a302.wms.domain.structure.dto.location.LocationResponse;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.mapper.ProductMapper;
import com.a302.wms.domain.product.repository.ProductRepository;
import com.a302.wms.domain.store.dto.StoreCreateRequest;
import com.a302.wms.domain.store.dto.StoreDetailResponse;
import com.a302.wms.domain.store.dto.StoreResponse;
import com.a302.wms.domain.structure.dto.wall.WallResponse;
import com.a302.wms.domain.structure.dto.wall.WallListCreateRequest;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.mapper.StoreMapper;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.structure.entity.Location;
import com.a302.wms.domain.structure.mapper.LocationMapper;
import com.a302.wms.domain.structure.mapper.WallMapper;
import com.a302.wms.domain.structure.service.LocationServiceImpl;
import com.a302.wms.domain.structure.service.StructureServiceImpl;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

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

        return StoreMapper.toResponseDto(savedStore);
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
        Store store = storeRepository.findById(storeUpdateRequest.storeId()).orElseThrow();
//        if(store.getUser().getId()!= user.getId()) throw

        store.update(storeUpdateRequest);
        Store updatedStore = storeRepository.save(store);
        return StoreMapper.toResponseDto(updatedStore);
    }

    /**
     * userId에 해당하는 모든 매장 정보를 조회
     *
     * @param userId : 조회할 매장의 정보
     * @return : userId에 해당하는 모든 매장의 리스트
     */
    public List<StoreResponse> findByUserId(Long userId) {
        log.info("[Service] find stores by userId");

        return storeRepository.findByUserId(userId)
                .stream()
                .map(StoreMapper::toResponseDto)
                .toList();
    }

    public StoreResponse findById(Long storeId) {
        log.info("[Service] find store");
        return StoreMapper.toResponseDto(storeRepository.findById(storeId).orElseThrow());
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

        Store store = storeRepository.findById(storeId).orElseThrow();
//        if(store.getUser().getId()!=userId) throw

        List<LocationResponse> locationList = store.getLocations().stream()
                .map(location ->
                    LocationMapper.toLocationResponseDto(location, getMaxFloorCapacity(location))
                ).toList();
        List<WallResponse> walls = store.getWalls().stream()
                .map(WallMapper::toResponseDto).toList();

        return StoreMapper.toDetailResponseDto(store, locationList, walls);
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
        Store store = storeRepository.findById(storeId).orElseThrow();
        storeRepository.delete(store);
    }

    /**
     * 매장 구조 생성
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
     * @param userId
     * @param storeId
     * @param structureUpdateRequest
     */
    public void updateStructure(Long userId, Long storeId, StructureUpdateRequest structureUpdateRequest) {
        log.info("[Service] update store structure");
        Store store = storeRepository.findById(storeId).orElseThrow();

        structureService.updateStructure(userId, storeId, structureUpdateRequest);
        Store savedStore = storeRepository.save(store);
    }

    /**
     * 매장 구조 삭제
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
     * @param userId
     * @param locationListCreateRequest
     */
    public void saveAllLocations(Long userId, LocationListCreateRequest locationListCreateRequest) {
        log.info("[Service] save all location");
        User user = userRepository.findById(userId).orElseThrow();
        Store store = storeRepository.findById(locationListCreateRequest.getStoreId()).orElseThrow();
//        if(store.getUser().getId()!=user.getId()) throw

        structureService.saveAllLocations(userId, locationListCreateRequest.getStoreId(), locationListCreateRequest.getRequests());
    }

    /**
     * 모든 wall을 해당 storeid의 매장에 저장하는 메서드
     * @param wallListCreateRequest
     */
    public void saveAllWall(Long userId, WallListCreateRequest wallListCreateRequest) {
        log.info("[Service] save all walls by storeId");
        Store store = storeRepository.findById(wallListCreateRequest.storeId()).orElseThrow();
        structureService.saveAllWalls(userId, wallListCreateRequest.storeId(), wallListCreateRequest.wallCreateDtos());
    }

    /**
     * 해당 매장에 있는 product를 모두 조회하는 메서드
     * @param storeId
     * @return
     */
    public List<ProductResponse> findProducts(Long storeId) {
        log.info("[Service] get all the products of the store: {}", storeId);
        return productRepository.findByStoreId(storeId).stream()
                .map(ProductMapper::toProductResponseDto)
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
