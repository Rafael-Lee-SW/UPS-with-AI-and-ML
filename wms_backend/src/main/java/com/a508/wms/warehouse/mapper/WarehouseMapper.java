package com.a508.wms.warehouse.mapper;

import com.a508.wms.location.dto.LocationResponseDto;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.dto.WallDto;
import com.a508.wms.warehouse.dto.WarehouseByBusinessDto;
import com.a508.wms.warehouse.dto.WarehouseDetailResponseDto;
import com.a508.wms.warehouse.dto.WarehouseDto;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class WarehouseMapper {

    /**
     * WarehouseDto -> Warehouse 객체. business와 locations 직접 설정하기
     *
     * @param warehouseDto
     * @return Warehouse
     */
    public static Warehouse fromDto(WarehouseDto warehouseDto) {
        return Warehouse.builder()
            .id(warehouseDto.getId())
            .size(warehouseDto.getSize())
            .name(warehouseDto.getName())
            .rowCount(warehouseDto.getRowCount())
            .columnCount(warehouseDto.getColumnCount())
            .facilityTypeEnum(warehouseDto.getFacilityTypeEnum())
            .statusEnum(warehouseDto.getStatusEnum())
            .build();
    }

    public static Warehouse fromWarehouseByBusinessDto(
        WarehouseByBusinessDto warehouseByBusinessDto) {
        return Warehouse.builder()
            .id(warehouseByBusinessDto.getId())
            .size(warehouseByBusinessDto.getSize())
            .name(warehouseByBusinessDto.getName())
            .rowCount(warehouseByBusinessDto.getRowCount())
            .columnCount(warehouseByBusinessDto.getColumnCount())
            .facilityTypeEnum(warehouseByBusinessDto.getFacilityTypeEnum())
            .statusEnum(warehouseByBusinessDto.getStatusEnum())
            .build();
    }

    /**
     * Warehouse -> WarehouseDto 변환
     *
     * @param warehouse
     * @return WarehouseDto
     */
    public static WarehouseDto fromWarehouse(Warehouse warehouse) {
        return WarehouseDto.builder()
            .id(warehouse.getId())
            .businessId(warehouse.getBusiness().getId())
            .size(warehouse.getSize())
            .name(warehouse.getName())
            .rowCount(warehouse.getRowCount())
            .columnCount(warehouse.getColumnCount())
            .facilityTypeEnum(warehouse.getFacilityTypeEnum())
            .priority(warehouse.getPriority())
            .createdDate(warehouse.getCreatedDate())
            .updatedDate(warehouse.getUpdatedDate())
            .statusEnum(warehouse.getStatusEnum())
            .build();
    }

    public static WarehouseByBusinessDto toWarehouseByBusinessDto(Warehouse warehouse) {
        return WarehouseByBusinessDto.builder()
            .id(warehouse.getId())
            .businessId(warehouse.getBusiness().getId())
            .size(warehouse.getSize())
            .name(warehouse.getName())
            .rowCount(warehouse.getRowCount())
            .columnCount(warehouse.getColumnCount())
            .facilityTypeEnum(warehouse.getFacilityTypeEnum())
            .priority(warehouse.getPriority())
            .createdDate(warehouse.getCreatedDate())
            .updatedDate(warehouse.getUpdatedDate())
            .statusEnum(warehouse.getStatusEnum())
            .build();
    }

    public static WarehouseDetailResponseDto toWarehouseDetailResponseDto(Warehouse warehouse,
        List<LocationResponseDto> locations, List<WallDto> walls) {
        return WarehouseDetailResponseDto.builder()
            .id(warehouse.getId())
            .size(warehouse.getSize())
            .name(warehouse.getName())
            .rowCount(warehouse.getRowCount())
            .columnCount(warehouse.getColumnCount())
            .facilityTypeEnum(warehouse.getFacilityTypeEnum())
            .locations(locations)
            .walls(walls)
            .build();
    }
}
