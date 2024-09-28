package com.a302.wms.domain.structure.mapper;

import com.a302.wms.domain.structure.dto.wall.WallCreateRequestDto;
import com.a302.wms.domain.structure.dto.wall.WallResponseDto;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.structure.entity.Wall;
import org.springframework.stereotype.Component;

@Component
public class WallMapper {

    /**
     * WallCreateRequestDto -> Wall 변환
     * @param wallCreateRequestDto : 변환될 Dto
     * @param store : Wall에 대한 Store 정보
     * @return : 변환된 Wall 객체
     */
    public static Wall fromCreateRequestDto(WallCreateRequestDto wallCreateRequestDto, Store store) {
        return Wall.builder()
                .startX(wallCreateRequestDto.startX())
                .startY(wallCreateRequestDto.startY())
                .endX(wallCreateRequestDto.endX())
                .endY(wallCreateRequestDto.endY())
                .store(store)
                .build();
    }

    /**
     * Wall -> WallResponseDto 변환
     * @param wall : 변환될 Wall 객체
     * @return : 변환된 Dto
     */
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
