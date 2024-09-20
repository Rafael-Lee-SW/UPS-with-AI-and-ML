package com.a302.wms.domain.store.mapper;

import com.a302.wms.domain.store.dto.StoreCreateRequestDto;
import com.a302.wms.domain.store.dto.StoreDetailResponseDto;
import com.a302.wms.domain.store.dto.StoreResponseDto;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.user.entity.User;
import org.springframework.stereotype.Component;

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

    public static StoreDetailResponseDto toDetailResponseDto(Store store/*, List<LocationResponseDto> locations,  List<WallDto> walls*/) {
        return StoreDetailResponseDto.builder()
                .id(store.getId())
                .userId(store.getUser().getId())
                .storeName(store.getStoreName())
                .createdDate(store.getCreatedDate())
                .updatedDate(store.getUpdatedDate())
                .build();
    }

}
