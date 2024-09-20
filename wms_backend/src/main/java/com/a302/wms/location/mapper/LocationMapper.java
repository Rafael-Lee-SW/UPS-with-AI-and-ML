package com.a302.wms.location.mapper;

import com.a302.wms.floor.mapper.FloorMapper;
import com.a302.wms.location.entity.Location;
import com.a302.wms.location.dto.LocationRequestDto;
import com.a302.wms.location.dto.LocationResponseDto;
import com.a302.wms.location.dto.LocationStorageResponseDto;
import com.a302.wms.location.dto.LocationUpdateDto;
import com.a302.wms.store.entity.Store;
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
            .productStorageType(request.getProductStorageType())
            .build();
    }

    /**
     * @param location
     * @return
     */
    public static LocationResponseDto toLocationResponseDto(Location location, int fill) {
        return LocationResponseDto.builder()
            .id(location.getId())
            .xPosition(location.getXPosition())
            .yPosition(location.getYPosition())
            .xSize(location.getXSize())
            .ySize(location.getYSize())
            .zSize(location.getZSize())
            .name(location.getName())
            .fill(fill)
            .storageType(location.getProductStorageType())
            .rotation(location.getRotation())
            .floorResponses(location.getFloors().stream().map(
                FloorMapper::toFloorResponseDto
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
            .productStorageType(request.getStorageType())
            .build();
    }
    public static LocationStorageResponseDto toLocationStorageResponseDto(Location location) {
        return LocationStorageResponseDto.builder()
                .id(location.getId())
                .floorStorage(location.getXSize() * location.getYSize() / location.getZSize())
                .build();
    }
}
