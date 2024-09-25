package com.a302.wms.domain.store.mapper;

import com.a302.wms.domain.location.dto.LocationResponseDto;
import com.a302.wms.domain.store.dto.store.StoreCreateRequestDto;
import com.a302.wms.domain.store.dto.store.StoreDetailResponseDto;
import com.a302.wms.domain.store.dto.store.StoreResponseDto;
import com.a302.wms.domain.store.dto.wall.WallCreateRequestDto;
import com.a302.wms.domain.store.dto.wall.WallResponseDto;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StoreMapper {

    /**
     * StoreCreateRequestDto -> Store 변환 
     * @param storeCreateRequestDto : 변환될 Dto 
     * @param user : 해당 store에 해당하는 유저 정보
     * @return : 변환된 Store 객체
     */
    public static Store fromDto(StoreCreateRequestDto storeCreateRequestDto, User user) {
        return Store.builder()
                .size(storeCreateRequestDto.size())
                .storeName(storeCreateRequestDto.storeName())
                .user(user)
                .createdDate(storeCreateRequestDto.createdDate())
                .updatedDate(storeCreateRequestDto.updatedDate())
                .build();
    }

    /**
     * Store -> StoreResponseDto 변환
     * @param store : 변환될 Store 객체
     * @return : 변환된 Dto
     */
    public static StoreResponseDto toResponseDto(Store store) {
        return StoreResponseDto.builder()
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
    public static StoreDetailResponseDto toDetailResponseDto(Store store, List<LocationResponseDto> locations, List<WallResponseDto> walls) {
        return StoreDetailResponseDto.builder()
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
