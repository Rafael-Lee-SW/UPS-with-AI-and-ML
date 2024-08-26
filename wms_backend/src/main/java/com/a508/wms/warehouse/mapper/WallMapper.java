package com.a508.wms.warehouse.mapper;

import com.a508.wms.warehouse.domain.Wall;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.dto.WallDto;
import org.springframework.stereotype.Component;

@Component
public class WallMapper {

    public static Wall fromDto(WallDto wallDto, Warehouse warehouse) {
        return Wall.builder()
            .id(wallDto.getId())
            .startX(wallDto.getStartX())
            .startY(wallDto.getStartY())
            .endX(wallDto.getEndX())
            .endY(wallDto.getEndY())
            .warehouse(warehouse)
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
