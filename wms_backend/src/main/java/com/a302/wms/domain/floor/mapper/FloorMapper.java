package com.a302.wms.domain.floor.mapper;

import com.a302.wms.domain.floor.dto.FloorResponse;
import com.a302.wms.domain.floor.entity.Floor;
import org.springframework.stereotype.Component;

@Component
public class FloorMapper {

    /**
     * Floor 객체를 FloorDto로 변환
     *
     * @param floor
     * @return FloorDto
     */
    public static FloorResponse toResponseDto(Floor floor) {
        return FloorResponse.builder()
            .id(floor.getId())
            .locationId(floor.getLocation().getId())
            .floorLevel(floor.getFloorLevel())
            .createdDate(floor.getCreatedDate())
            .updatedDate(floor.getUpdatedDate())
            .build();
    }

}
