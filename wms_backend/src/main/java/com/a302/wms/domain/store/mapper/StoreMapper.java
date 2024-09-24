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

    public static Store fromDto(StoreCreateRequestDto dto, User user) {
        return Store.builder()
                .size(dto.size())
                .storeName(dto.storeName())
                .user(user)
                .createdDate(dto.createdDate())
                .updatedDate(dto.updatedDate())
                .build();
    }

    public static StoreResponseDto toResponseDto(Store store) {
        return StoreResponseDto.builder()
                .id(store.getId())
                .userId(store.getUser().getId())
                .storeName(store.getStoreName())
                .createdDate(store.getCreatedDate())
                .updatedDate(store.getUpdatedDate())
                .build();
    }

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
