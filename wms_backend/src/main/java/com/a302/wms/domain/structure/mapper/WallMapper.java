package com.a302.wms.domain.structure.mapper;

import com.a302.wms.domain.structure.dto.wall.WallCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallResponse;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.structure.entity.Wall;
import org.springframework.stereotype.Component;

@Component
public class WallMapper {

    /**
     * WallCreateRequestDto -> Wall 변환
     * @param wallCreateRequest : 변환될 Dto
     * @param store : Wall에 대한 Store 정보
     * @return : 변환된 Wall 객체
     */
    public static Wall fromCreateRequestDto(WallCreateRequest wallCreateRequest, Store store) {
        return Wall.builder()
                .startX(wallCreateRequest.startX())
                .startY(wallCreateRequest.startY())
                .endX(wallCreateRequest.endX())
                .endY(wallCreateRequest.endY())
                .store(store)
                .build();
    }


    /**
     * Wall -> WallResponseDto 변환
     * @param wall : 변환될 Wall 객체
     * @return : 변환된 Dto
     */
    public static WallResponse toResponseDto(Wall wall) {
        return WallResponse.builder()
                .id(wall.getId())
                .startX(wall.getStartX())
                .startY(wall.getStartY())
                .endX(wall.getEndX())
                .endY(wall.getEndY())
                .build();
    }
}
