//package com.a508.wms.service;
//
//import com.a508.wms.business.domain.Business;
//import com.a508.wms.business.repository.BusinessRepository;
//import com.a508.wms.location.service.LocationService;
//import com.a508.wms.util.constant.FacilityTypeEnum;
//import com.a508.wms.util.constant.StatusEnum;
//import com.a508.wms.warehouse.domain.Warehouse;
//import com.a508.wms.warehouse.dto.WarehouseDto;
//import com.a508.wms.warehouse.repository.WarehouseRepository;
//import com.a508.wms.warehouse.service.WarehouseService;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class WarehouseServiceTest {
//
//    @Mock
//    private WarehouseRepository warehouseRepository;
//
//    @Mock
//    private BusinessRepository businessRepository;
//
//    @Mock
//    private LocationService locationService;
//
//    @InjectMocks
//    private WarehouseService warehouseService;
//
//    @Test
//    void save_ShouldSaveWarehouse() {
//        // given
//        WarehouseDto warehouseDto = WarehouseDto.builder()
//                .id(1L)
//                .businessId(1L)
//                .size(100)
//                .name("Test Warehouse")
//                .priority(1)
//                .facilityType(FacilityTypeEnum.WAREHOUSE)
//                .build();
//
//        Business business = Business.builder()
//                .id(1L).build();
//
//        Warehouse warehouse = Warehouse.builder()
//                .business(business)
//                .size(100)
//                .name("Test Warehouse")
//                .rowCount(10)
//                .columnCount(10)
//                .priority(1)
//                .facilityType(FacilityTypeEnum.WAREHOUSE)
//                .build();
//
//        when(businessRepository.findById(1L)).thenReturn(Optional.of(business));
//        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(warehouse);
//
//        // when
//        WarehouseDto savedWarehouseDto = warehouseService.save(warehouseDto);
//
//
//        // then
//        assertThat(savedWarehouseDto.getName()).isEqualTo("Test Warehouse");
//        assertThat(savedWarehouseDto.getSize()).isEqualTo(100);
//
//        verify(businessRepository, times(1)).findById(1L);
//        verify(warehouseRepository, times(1)).save(any(Warehouse.class));
//    }
//
//    @Test
//    void findByBusinessId_ShouldReturnWarehouseList() {
//        // given
//        Warehouse warehouse = new Warehouse();
//        warehouse.setId(1L);
//        warehouse.setName("Test Warehouse");
//
//        when(warehouseRepository.findByBusinessId(1L)).thenReturn(List.of(warehouse));
//
//        // when
//        List<WarehouseDto> warehouseDtos = warehouseService.findByBusinessId(1L);
//
//        // then
//        assertThat(warehouseDtos).hasSize(1);
//        assertThat(warehouseDtos.get(0).getName()).isEqualTo("Test Warehouse");
//
//        verify(warehouseRepository, times(1)).findByBusinessId(1L);
//    }
//
//    @Test
//    void findByWarehouseId_ShouldReturnWarehouse() {
//        // given
//        Warehouse warehouse = new Warehouse();
//        warehouse.setId(1L);
//        warehouse.setName("Test Warehouse");
//
//        when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
//
//        // when
//        WarehouseDto warehouseDto = warehouseService.findByWarehouseId(1L);
//
//        // then
//        assertThat(warehouseDto.getName()).isEqualTo("Test Warehouse");
//
//        verify(warehouseRepository, times(1)).findById(1L);
//    }
//
//    @Test
//    void updateWarehouse_ShouldUpdateWarehouse() {
//        // given
//        Warehouse warehouse = new Warehouse();
//        warehouse.setId(1L);
//        warehouse.setName("Test Warehouse");
//        warehouse.setSize(100);
//
//        WarehouseDto warehouseDto = WarehouseDto.builder()
//                .size(200)
//                .name("Updated Warehouse")
//                .priority(2)
//                .facilityType(FacilityTypeEnum.WAREHOUSE)
//                .build();
//
//        when(warehouseRepository.findByBusinessIdAndId(1L, 1L)).thenReturn(Optional.of(warehouse));
//        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(warehouse);
//
//        // when
//        WarehouseDto updatedWarehouseDto = warehouseService.updateWarehouse(1L, 1L, warehouseDto);
//
//        // then
//        assertThat(updatedWarehouseDto.getName()).isEqualTo("Updated Warehouse");
//        assertThat(updatedWarehouseDto.getSize()).isEqualTo(200);
//
//        verify(warehouseRepository, times(1)).findByBusinessIdAndId(1L, 1L);
//        verify(warehouseRepository, times(1)).save(any(Warehouse.class));
//    }
//
//    @Test
//    void deleteWarehouse_ShouldSetStatusToInactive() {
//        // given
//        Warehouse warehouse = new Warehouse();
//        warehouse.setId(1L);
//        warehouse.setName("Test Warehouse");
//
//        when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
//
//        // when
//        warehouseService.deleteWarehouse(1L);
//
//        // then
//        assertThat(warehouse.getStatusEnum()).isEqualTo(StatusEnum.INACTIVE);
//
//        verify(warehouseRepository, times(1)).findById(1L);
//        verify(warehouseRepository, times(1)).save(warehouse);
//    }
//}
