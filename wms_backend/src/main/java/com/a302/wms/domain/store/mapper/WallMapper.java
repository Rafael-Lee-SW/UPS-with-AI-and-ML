package com.a302.wms.domain.store.mapper;

import com.a302.wms.domain.store.dto.wall.WallCreateRequestDto;
import com.a302.wms.domain.store.dto.wall.WallResponseDto;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.entity.Wall;
import org.springframework.stereotype.Component;

@Component
public class WallMapper {

    public static Wall fromCreateRequestDto(WallCreateRequestDto dto, Store store) {
        return Wall.builder()
                .startX(dto.startX())
                .startY(dto.startY())
                .endX(dto.endX())
                .endY(dto.endY())
                .store(store)
                .build();
    }

    public static WallResponseDto toResponseDto(Wall wall) {
        return WallResponseDto.builder()
                .id(wall.getId())
                .startX(wall.getStartX())
                .startY(wall.getStartY())
                .endX(wall.getEndX())
                .endY(wall.getEndY())
                .build();
    }
}
