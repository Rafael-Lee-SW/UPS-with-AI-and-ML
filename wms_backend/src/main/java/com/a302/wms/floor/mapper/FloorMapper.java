package com.a302.wms.floor.mapper;

import com.a302.wms.floor.entity.Floor;
import com.a302.wms.floor.dto.FloorRequestDto;
import com.a302.wms.floor.dto.FloorResponseDto;
import com.a302.wms.product.dto.ProductMoveRequestDto;
import org.springframework.stereotype.Component;

@Component
public class FloorMapper {

    /**
     * Floor가 포함하고 있는 location 객체를 제외하고 Convert. 해당 메서드를 호출한 Service Layer에서 location을 직접 설정하기
     *
     * @param floorResponseDto
     * @return Floor
     */
    public static Floor fromFloorResponseDto(FloorResponseDto floorResponseDto) {
        return Floor.builder()
            .id(floorResponseDto.id())
            .floorLevel(floorResponseDto.floorLevel())
            .build();
    }

    /**
     * Floor 객체를 FloorDto로 변환
     *
     * @param floor
     * @return FloorDto
     */
    public static FloorResponseDto toFloorResponseDto(Floor floor) {
        return FloorResponseDto.builder()
            .id(floor.getId())
            .locationId(floor.getLocation().getId())
            .floorLevel(floor.getFloorLevel())
            .createdDate(floor.getCreatedDate())
            .updatedDate(floor.getUpdatedDate())
            .build();
    }

    public static Floor fromFloorRequestDto(FloorRequestDto floorRequestDto) {
        return Floor.builder()
            .floorLevel(floorRequestDto.floorLevel())
            .build();
    }
    public static ProductMoveRequestDto toProductMoveRequestDto(Floor floor) {
        return ProductMoveRequestDto.builder()
                .floorLevel(floor.getFloorLevel())
                .build();
    }

}
