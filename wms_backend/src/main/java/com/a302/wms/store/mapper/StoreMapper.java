package com.a302.wms.store.mapper;

import com.a302.wms.location.dto.LocationResponseDto;
import com.a302.wms.store.entity.Store;
import com.a302.wms.store.dto.WallDto;
import com.a302.wms.store.dto.StoreByUserDto;
import com.a302.wms.store.dto.StoreDetailResponseDto;
import com.a302.wms.store.dto.StoreRequestDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StoreMapper {

    /**
     * StoreDto -> Store 객체. user와 locations 직접 설정하기
     *
     * @param warehouseDto
     * @return Store
     */
    public static Store fromDto(StoreRequestDto warehouseDto) {
        return Store.builder()
            .id(warehouseDto.getId())
            .size(warehouseDto.getSize())
            .name(warehouseDto.getName())
            .rowCount(warehouseDto.getRowCount())
            .columnCount(warehouseDto.getColumnCount())
            .build();
    }

    public static Store fromStoreByUserDto(
        StoreByUserDto storeByUserDto) {
        return Store.builder()
            .id(storeByUserDto.id())
            .size(storeByUserDto.size())
            .name(storeByUserDto.name())
            .rowCount(storeByUserDto.rowCount())
            .columnCount(storeByUserDto.columnCount())
            .build();
    }

    /**
     * Store -> StoreDto 변환
     *
     * @param store
     * @return StoreDto
     */
    public static StoreRequestDto fromStore(Store store) {
        return StoreRequestDto.builder()
            .id(store.getId())
            .userId(store.getUser().getId())
            .size(store.getSize())
            .name(store.getName())
            .rowCount(store.getRowCount())
            .columnCount(store.getColumnCount())
            .priority(store.getPriority())
            .createdDate(store.getCreatedDate())
            .updatedDate(store.getUpdatedDate())
            .build();
    }

    public static StoreByUserDto toStoreByUserDto(Store store) {
        return StoreByUserDto.builder()
            .id(store.getId())
            .userId(store.getUser().getId())
            .size(store.getSize())
            .name(store.getName())
            .rowCount(store.getRowCount())
            .columnCount(store.getColumnCount())
            .priority(store.getPriority())
            .createdDate(store.getCreatedDate())
            .updatedDate(store.getUpdatedDate())
            .build();
    }

    public static StoreDetailResponseDto toStoreDetailResponseDto(Store store,
        List<LocationResponseDto> locations, List<WallDto> walls) {
        return StoreDetailResponseDto.builder()
            .id(store.getId())
            .size(store.getSize())
            .name(store.getName())
            .rowCount(store.getRowCount())
            .columnCount(store.getColumnCount())
            .locations(locations)
            .walls(walls)
            .build();
    }
}
