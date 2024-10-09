package com.a302.wms.domain.structure.mapper;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.mapper.FloorMapper;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.structure.dto.location.LocationCreateRequest;
import com.a302.wms.domain.structure.dto.location.LocationResponse;
import com.a302.wms.domain.structure.dto.location.LocationStorageResponse;
import com.a302.wms.domain.structure.dto.location.LocationUpdateRequest;
import com.a302.wms.domain.structure.entity.Location;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LocationMapper {

    /**
     * @param request
     * @param store
     * @return
     */
    public static Location fromLocationRequestDto(LocationCreateRequest request,
                                                  Store store, List<Floor> floorList) {
        return Location.builder()
                .name(request.getName())
                .xPosition(request.getXPosition())
                .yPosition(request.getYPosition())
                .xSize(request.getXSize())
                .ySize(request.getYSize())
                .zSize(request.getZSize())
                .rotation(request.getRotation())
                .store(store)
                .floorList(floorList)
                .build();
    }

    /**
     * @param location
     * @param maxFloorCapacity
     * @return
     */
    public static LocationResponse toLocationResponseDto(Location location, int maxFloorCapacity) {
        return LocationResponse.builder()
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

    public static Location fromLocationUpdateDto(LocationUpdateRequest request,
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

    public static LocationStorageResponse toLocationStorageResponseDto(Location location) {
        return LocationStorageResponse.builder()
                .id(location.getId())
                .floorStorage(location.getXSize() * location.getYSize() / location.getZSize())
                .build();
    }
}
