package com.a302.wms.domain.store.service;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorServiceImpl;
import com.a302.wms.domain.location.dto.LocationResponseDto;
import com.a302.wms.domain.location.entity.Location;
import com.a302.wms.domain.location.mapper.LocationMapper;
import com.a302.wms.domain.location.repository.LocationRepository;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.mapper.ProductMapper;
import com.a302.wms.domain.product.repository.ProductRepository;
import com.a302.wms.domain.store.dto.store.StoreCreateRequestDto;
import com.a302.wms.domain.store.dto.store.StoreDetailResponseDto;
import com.a302.wms.domain.store.dto.store.StoreResponseDto;
import com.a302.wms.domain.store.dto.wall.WallResponseDto;
import com.a302.wms.domain.store.dto.wall.WallsCreateDto;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.entity.Wall;
import com.a302.wms.domain.store.mapper.StoreMapper;
import com.a302.wms.domain.store.mapper.WallMapper;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.domain.store.repository.WallRepository;
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
    private final LocationRepository locationRepository;
    private final WallRepository wallRepository;
    private final FloorServiceImpl floorService;
    private final FloorRepository floorRepository;
    private final ProductRepository productRepository;


    /**
     * 매장을 생성하는 메서드
     *
     * @param userId : 생성할 매장의 userId
     * @param storeCreateRequestDto : 생성할 매장의 정보
     * @return : 생성한 매장의 정보
     */
    @Transactional
    public StoreResponseDto save(Long userId, StoreCreateRequestDto storeCreateRequestDto) {
        log.info("[Service] save store");

        User user = userRepository.findById(userId).orElseThrow();

        Store savedStore = storeRepository.save(StoreMapper.fromDto(storeCreateRequestDto, user));

        return StoreMapper.toResponseDto(savedStore);
    }

    /**
     * userId에 해당하는 모든 매장 정보를 조회
     * @param userId : 조회할 매장의 정보
     * @return : userId에 해당하는 모든 매장의 리스트
     */
    public List<StoreResponseDto> findByUserId(Long userId) {
        log.info("[Service] find stores by userId");


        return storeRepository.findByUserId(userId)
                .stream()
                .map(StoreMapper::toResponseDto)
                .toList();
    }

    /**
     * 매장의 세부 정보를 조회
     * @param userId : 조회할 매장의 userId
     * @param storeId : 조회할 매장의 storeId
     * @return : userId, StoreId에 해당하는 매장의 세부 정보
     */
    @Transactional
    public StoreDetailResponseDto findById(Long userId, Long storeId) {
        log.info("[Service] find store:");

        Store store = storeRepository.findById(storeId).orElseThrow();

        List<LocationResponseDto> locations = locationRepository.findAllByStoreId(
                        storeId)
                .stream()
                .map(location -> LocationMapper.toLocationResponseDto(location,
                        getMaxFloorCapacity(location)))
                .toList();

        List<WallResponseDto> walls = wallRepository.findByStoreId(storeId)
                .stream()
                .map(WallMapper::toResponseDto)
                .toList();

        return StoreMapper.toDetailResponseDto(store, locations, walls);
    }


    /**
     * Floor의 최대 적재 가능 개수를 반환
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

    /**
     * 특정 매장 삭제
     * @param userId : 삭제할 매장의 userId
     * @param storeId : 삭제할 매장의 storeId
     */
    @Transactional
    public void delete(Long userId, Long storeId) {
        log.info("[Service] delete store by id");
        Store store = storeRepository.findById(storeId).orElseThrow();
        storeRepository.delete(store);
    }


        public void saveAllWall(WallsCreateDto dto) {
        log.info("[Service] save all walls by storeId");
        Store store = storeRepository.findById(dto.storeId()).orElseThrow();
        List<Wall> wallList = dto.wallCreateDtos().stream()
                .map(wallCreateDto->
                    WallMapper.fromCreateRequestDto(wallCreateDto, store)
                )
                .toList();
        wallRepository.saveAll(wallList);
    }

    public List<ProductResponse> findProducts(Long storeId) {
        log.info("[Service] get all the products of the store: {}", storeId);
        return productRepository.findByStoreId(storeId).stream()
                .map(ProductMapper::toProductResponseDto)
                .toList();
    }



}
