package com.a302.wms.domain.store.service;

import com.a302.wms.domain.store.dto.StoreCreateRequestDto;
import com.a302.wms.domain.store.dto.StoreDetailResponseDto;
import com.a302.wms.domain.store.dto.StoreResponseDto;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.mapper.StoreMapper;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
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


    @Transactional
    public StoreResponseDto save(Long userId, StoreCreateRequestDto storeCreateRequestDto) {
        log.info("[Service] save store");

        //TODO user validation
        User user = userRepository.findById(userId).orElseThrow();

        Store savedStore = storeRepository.save(StoreMapper.fromDto(storeCreateRequestDto, user));

        return StoreMapper.toResponseDto(savedStore);
    }

    public List<StoreResponseDto> findByUserId(Long userId) {
        log.info("[Service] find stores by userId: {}", userId);

        User user = userRepository.findById(userId).orElseThrow();

        List<StoreResponseDto> storeList = storeRepository.findByUserId(userId)
                .stream()
                .map(StoreMapper::toResponseDto)
                .toList();

        return storeList;
    }

    @Transactional
    public StoreDetailResponseDto findById(Long userId, Long storeId) {
        log.info("[Service] find store: {}", storeId);

        User user = userRepository.findById(userId).orElseThrow();
        Store store = storeRepository.findById(storeId).orElseThrow();
//
//        List<LocationResponseDto> locations = locationModuleService.findAllByWarehouseId(
//                        id)
//                .stream()
//                .map(location -> LocationMapper.toLocationResponseDto(location,
//                        getMaxFloorCapacity(location)))
//                .toList();
//
//        List<WallDto> walls = wallModuleService.findByWarehouseId(id)
//                .stream()
//                .map(WallMapper::toWallDto)
//                .toList();

//        return StoreMapper.toDetailResponseDto(store, locations, walls);
        return StoreDetailResponseDto.builder().build();
    }

//    @Transactional
//    public StoreDetailResponseDto updateLocationsAndWalls(
//            Long userId, Location
//    )
}
