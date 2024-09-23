package com.a302.wms.store.dto;


import com.a302.wms.location.dto.LocationResponseDto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class StoreRequestDto {

    private Long id;
    private Long userId;
    private int size;
    private String name;
    private int rowCount;
    private int columnCount;
    private int priority;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private List<LocationResponseDto> locations;
    private List<WallDto> walls;


}