package com.a302.wms.domain.store.mapper;

import com.a302.wms.domain.structure.dto.location.LocationResponse;
import com.a302.wms.domain.store.dto.StoreCreateRequest;
import com.a302.wms.domain.store.dto.StoreDetailResponse;
import com.a302.wms.domain.store.dto.StoreResponse;
import com.a302.wms.domain.structure.dto.wall.WallResponse;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StoreMapper {

    /**
     * StoreCreateRequestDto -> Store 변환 
     * @param storeCreateRequest : 변환될 Dto
     * @param user : 해당 store에 해당하는 유저 정보
     * @return : 변환된 Store 객체
     */
    public static Store fromCreateRequestDto(StoreCreateRequest storeCreateRequest, User user) {
        return Store.builder()
                .size(storeCreateRequest.size())
                .storeName(storeCreateRequest.storeName())
                .user(user)
                .build();
    }

    /**
     * Store -> StoreResponseDto 변환
     * @param store : 변환될 Store 객체
     * @return : 변환된 Dto
     */
    public static StoreResponse toResponseDto(Store store) {
        return StoreResponse.builder()
                .id(store.getId())
                .userId(store.getUser().getId())
                .storeName(store.getStoreName())
                .createdDate(store.getCreatedDate())
                .updatedDate(store.getUpdatedDate())
                .build();
    }

    /**
     * Store -> StoreDetailResponseDto 변환
     * @param store : 변환될 Store 객체
     * @param locations : Store에 해당하는 로케이션 정보
     * @param walls : Store에 해당하는 벽 정보
     * @return : 변환된 Dto
     */
    public static StoreDetailResponse toDetailResponseDto(Store store, List<LocationResponse> locations, List<WallResponse> walls) {
        return StoreDetailResponse.builder()
                .id(store.getId())
                .userId(store.getUser().getId())
                .storeName(store.getStoreName())
                .locations(locations)
                .walls(walls)
                .createdDate(store.getCreatedDate())
                .updatedDate(store.getUpdatedDate())
                .build();
    }

}
