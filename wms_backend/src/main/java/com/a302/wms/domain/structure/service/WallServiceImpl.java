package com.a302.wms.domain.structure.service;

import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.structure.dto.wall.WallCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallListCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallResponse;
import com.a302.wms.domain.structure.dto.wall.WallUpdateRequest;
import com.a302.wms.domain.structure.entity.Wall;
import com.a302.wms.domain.structure.mapper.WallMapper;
import com.a302.wms.domain.structure.repository.WallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WallServiceImpl {

    private final WallRepository wallRepository;
    private final StoreRepository storeRepository;

    public List<WallResponse> findAllByStoreId(Long storeId) {
        return wallRepository.findByStoreId(storeId)
                .stream()
                .map(WallMapper::toResponseDto)
                .toList();
    }


    public void saveAll(Long userId, Long storeId, WallListCreateRequest wallListCreateRequest) {
        Store store = storeRepository.findById(storeId).orElseThrow();
        wallListCreateRequest.wallCreateDtos().forEach(wallCreateRequest -> {
            Wall wall = WallMapper.fromCreateRequestDto(wallCreateRequest, store);
            store.getWalls().add(wall);
        });
    }

    public void save(Long userId, Long storeId, WallCreateRequest wallCreateRequest) {
        Store store = storeRepository.findById(storeId).orElseThrow();
        Wall wall = WallMapper.fromCreateRequestDto(wallCreateRequest, store);
        store.getWalls().add(wall);

    }

    public void updateAll(Long userId, Long storeId, List<WallUpdateRequest> wallUpdateRequestList) {
        Store store = storeRepository.findById(storeId).orElseThrow(null);
        wallUpdateRequestList.forEach(wallUpdateRequest -> {

        });
    }
}
