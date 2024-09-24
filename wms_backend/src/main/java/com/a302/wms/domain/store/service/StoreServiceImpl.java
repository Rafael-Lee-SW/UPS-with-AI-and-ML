package com.a302.wms.domain.store.service;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.floor.service.FloorService;
import com.a302.wms.domain.location.dto.LocationResponseDto;
import com.a302.wms.domain.location.entity.Location;
import com.a302.wms.domain.location.mapper.LocationMapper;
import com.a302.wms.domain.location.repository.LocationRepository;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/store")
public class StoreServiceImpl {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final WallRepository wallRepository;
    private final FloorService floorService;
    private final FloorRepository floorRepository;


    /**
     * 최초 매장을 생성하는 메서드
     *
     * @param userId
     * @param storeCreateRequestDto
     * @return
     */
    @Transactional
    public StoreResponseDto save(Long userId, StoreCreateRequestDto storeCreateRequestDto) {
        log.info("[Service] save store");

        //TODO user validation
        User user = userRepository.findById(userId).orElseThrow();

        Store savedStore = storeRepository.save(StoreMapper.fromDto(storeCreateRequestDto, user));

        return StoreMapper.toResponseDto(savedStore);
    }

    /**
     * 유저 ID로 매장 목록을 조회하는 메서드
     * @param userId
     * @return
     */
    public List<StoreResponseDto> findByUserId(Long userId) {
        log.info("[Service] find stores by userId: {}", userId);

        User user = userRepository.findById(userId).orElseThrow();

        List<StoreResponseDto> storeList = storeRepository.findByUserId(userId)
                .stream()
                .map(StoreMapper::toResponseDto)
                .toList();

        return storeList;
    }

    /**
     * 매장 ID로 매장 세부 정보를 조회하는 메서드
     * @param userId
     * @param storeId
     * @return
     */
    @Transactional
    public StoreDetailResponseDto findById(Long userId, Long storeId) {
        log.info("[Service] find store: {}", storeId);

        User user = userRepository.findById(userId).orElseThrow();
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


    private int getMaxFloorCapacity(Location location) {
        List<Floor> floors = floorRepository.findAllByLocationId(location.getId());

        return floors.stream()
                .mapToInt(floorService::getCapacity)
                .max()
                .orElse(0);
    }

    /**
     * 매장을 삭제하는 메서드
     * @param userId
     * @param storeId
     */
    @Transactional
    public void delete(Long userId, Long storeId) {
        log.info("[Service] delete store by id: {}", storeId);
        Store store = storeRepository.findById(storeId).orElseThrow();
        storeRepository.delete(store);
    }


    /**TODO: 수정
     *
     * @param dto
     */
    public void saveAllWall(WallsCreateDto dto) {
        log.info("[Service] save all walls by storeId: {}", dto.storeId());
        Store store = storeRepository.findById(dto.storeId()).orElseThrow();
        List<Wall> wallList = dto.wallCreateDtos().stream()
                .map(wallCreateDto->
                    WallMapper.fromCreateRequestDto(wallCreateDto, store)
                )
                .toList();
        wallRepository.saveAll(wallList);
    }

//    public int findStoreCntByUserId(Long userId) {
//        log.info("[Service] find store count of user: {}", userId);
//        return storeRepository.countByUserId(userId);
//    }

}
