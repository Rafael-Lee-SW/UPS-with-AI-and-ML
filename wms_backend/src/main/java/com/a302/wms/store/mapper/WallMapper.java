package com.a302.wms.store.mapper;

import com.a302.wms.store.entity.Wall;
import com.a302.wms.store.entity.Store;
import com.a302.wms.store.dto.WallDto;
import org.springframework.stereotype.Component;

@Component
public class WallMapper {

    public static Wall fromDto(WallDto wallDto, Store store) {
        return Wall.builder()
            .id(wallDto.getId())
            .startX(wallDto.getStartX())
            .startY(wallDto.getStartY())
            .endX(wallDto.getEndX())
            .endY(wallDto.getEndY())
            .store(store)
            .build();
    }

    public static WallDto toWallDto(Wall wall) {
        return WallDto.builder()
            .id(wall.getId())
            .startX(wall.getStartX())
            .startY(wall.getStartY())
            .endX(wall.getEndX())
            .endY(wall.getEndY())
            .build();
    }

}
