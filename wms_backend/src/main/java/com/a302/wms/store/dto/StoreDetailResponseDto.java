package com.a302.wms.store.dto;

import com.a302.wms.location.dto.LocationResponseDto;

import lombok.Builder;

import java.util.List;

public record StoreDetailResponseDto(Long id,
                                     int size,
                                     String name,
                                     int rowCount,
                                     int columnCount,
                                     int priority,
                                     List<LocationResponseDto> locations,
                                     List<WallDto> walls) {

    @Builder

    public StoreDetailResponseDto(Long id,
                                  int size,
                                  String name,
                                  int rowCount,
                                  int columnCount,
                                  int priority,
                                  List<LocationResponseDto> locations,
                                  List<WallDto> walls) {
        this.id = id;
        this.size = size;
        this.name = name;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.priority = priority;
        this.locations = locations;
        this.walls = walls;
    }
}
