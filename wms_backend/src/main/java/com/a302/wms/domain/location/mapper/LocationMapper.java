package com.a302.wms.domain.location.mapper;

import com.a302.wms.domain.location.dto.LocationStorageResponseDto;
import com.a302.wms.domain.location.dto.LocationUpdateDto;
import com.a302.wms.domain.floor.mapper.FloorMapper;
import com.a302.wms.domain.location.entity.Location;
import com.a302.wms.domain.location.dto.LocationRequestDto;
import com.a302.wms.domain.location.dto.LocationResponseDto;
import com.a302.wms.domain.store.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class LocationMapper {

    /**
     * @param request
     * @param store
     * @return
     */
    public static Location fromLocationRequestDto(LocationRequestDto request,
        Store store) {
        return Location.builder()
            .name(request.getName())
            .xPosition(request.getXPosition())
            .yPosition(request.getYPosition())
            .xSize(request.getXSize())
            .ySize(request.getYSize())
            .zSize(request.getZSize())
            .rotation(request.getRotation())
            .store(store)
            .build();
    }

    /**
     * @param location
     * @return
     */
    public static LocationResponseDto toLocationResponseDto(Location location) {
        return LocationResponseDto.builder()
            .id(location.getId())
            .xPosition(location.getXPosition())
            .yPosition(location.getYPosition())
            .xSize(location.getXSize())
            .ySize(location.getYSize())
            .zSize(location.getZSize())
            .name(location.getName())
            .rotation(location.getRotation())
            .floorResponses(location.getFloorList().stream().map(
                FloorMapper::toResponseDto
            ).toList())
            .build();
    }

    public static Location fromLocationUpdateDto(LocationUpdateDto request,
                                                 Store store) {
        return Location.builder()
            .id(request.getId())
            .name(request.getName())
            .rotation(request.getRotation())
            .xPosition(request.getXPosition())
            .yPosition(request.getYPosition())
            .xSize(request.getXSize())
            .ySize(request.getYSize())
            .zSize(request.getZSize())
            .store(store)
            .build();
    }
    public static LocationStorageResponseDto toLocationStorageResponseDto(Location location) {
        return LocationStorageResponseDto.builder()
                .id(location.getId())
                .floorStorage(location.getXSize() * location.getYSize() / location.getZSize())
                .build();
    }
}
