package com.a508.wms.warehouse.controller;

import com.a508.wms.util.BaseSuccessResponse;
import com.a508.wms.warehouse.dto.LocationsAndWallsRequestDto;
import com.a508.wms.warehouse.dto.WallRequestDto;
import com.a508.wms.warehouse.dto.WarehouseByBusinessDto;
import com.a508.wms.warehouse.dto.WarehouseDetailResponseDto;
import com.a508.wms.warehouse.dto.WarehouseDto;
import com.a508.wms.warehouse.service.WarehouseService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/warehouses")
public class WarehouseController {

    //의존성주입
    private final WarehouseService warehouseService;

    /**
     * 사업자 id의 창고를 저장 POST 방식
     */
    @PostMapping
    public BaseSuccessResponse<WarehouseDto> save(
        @RequestBody WarehouseDto warehouseDto) {
        log.info("[Controller] save Warehouse");
        return new BaseSuccessResponse<>(warehouseService.save(warehouseDto));
    }

    /**
     * 비지니스 id로 창고 조회 GET 방식
     */
    @GetMapping
    public BaseSuccessResponse<List<WarehouseByBusinessDto>> findAllByBusinessId(
        @RequestParam Long businessId) {
        log.info("[Controller] find Warehouses by businessId: {}", businessId);
        return new BaseSuccessResponse<>(warehouseService.findByBusinessId(businessId));
    }

    @GetMapping("/{id}")
    public BaseSuccessResponse<WarehouseDetailResponseDto> findById(@PathVariable Long id) {
        log.info("[Controller] find Warehouse by id: {}", id);
        return new BaseSuccessResponse<>(warehouseService.findById(id));
    }

    /*
   창고 id의 상태를 비활성화 (status를 0으로 변경) PATCH 방식
   */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> delete(@PathVariable Long id) {
        log.info("[Controller] delete Warehouse by id: {}", id);
        warehouseService.delete(id);
        return new BaseSuccessResponse<>(null);
    }

    @PostMapping("/walls")
    public BaseSuccessResponse<Void> saveAllWall(@RequestBody WallRequestDto request) {
        log.info("[Controller] save Walls: ");
        warehouseService.saveAllWall(request);
        return new BaseSuccessResponse<>(null);
    }

    @PutMapping("/{id}/locatons-and-walls")
    public BaseSuccessResponse<WarehouseDetailResponseDto> updateLocationsAndWalls(
        @PathVariable Long id, @RequestBody LocationsAndWallsRequestDto request
    ) {
        log.info("[Controller] update Warehouse Locations And Walls by id: {}", id);
        return new BaseSuccessResponse<>(
            warehouseService.updateLocationsAndWalls(id, request));
    }

    @GetMapping("/cnt/{businessId}")
    public BaseSuccessResponse<Integer> findWarehouseCntByBusinessId(
        @PathVariable Long businessId) {
        log.info("[Controller] find Warehouse cnt by businessId: {}", businessId);
        int count = warehouseService.findWarehouseCntByBusinessId(businessId);
        return new BaseSuccessResponse<>(count);
    }

    @GetMapping("/pcscnt/{id}")
    public BaseSuccessResponse<Integer> findAllPscCount(@PathVariable Long id) {
        return new BaseSuccessResponse<>(warehouseService.findAllPscCount(id));
    }

    @GetMapping("/locationcnt/{id}")
    public BaseSuccessResponse<Integer> findLocationCnt(@PathVariable Long id) {
        return new BaseSuccessResponse<>(warehouseService.findLocationCnt(id));
    }

    @GetMapping("/usage/{id}")
    public BaseSuccessResponse<Integer> findUsage(@PathVariable Long id) {
        return new BaseSuccessResponse<>(warehouseService.findUsage(id));
    }

    @GetMapping("/purpose/{id}")
    public BaseSuccessResponse<Integer> findPurpose(@PathVariable Long id) {
        return new BaseSuccessResponse<>(warehouseService.findPurpose(id));
    }
}
