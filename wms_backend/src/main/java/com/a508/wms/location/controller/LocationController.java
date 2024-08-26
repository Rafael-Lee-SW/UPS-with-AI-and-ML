package com.a508.wms.location.controller;

import com.a508.wms.floor.exception.FloorException;
import com.a508.wms.location.dto.LocationRequestDto;
import com.a508.wms.location.dto.LocationResponseDto;
import com.a508.wms.location.dto.LocationSaveRequestDto;
import com.a508.wms.location.service.LocationService;
import com.a508.wms.util.BaseSuccessResponse;
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
@RequestMapping("/locations")
public class LocationController {

    private final LocationService locationService;

    /**
     * @param warehouseId -> 창고 아이디 (필수 )
     * @return warehouseId값 없으면 전체 조회, 있으면 특정 창고가 보유한 로케이션들 조회
     */
    @GetMapping
    public BaseSuccessResponse<List<LocationResponseDto>> findAllByWarehouseId(
        @RequestParam(name = "warehouseId") Long warehouseId) throws FloorException {
        log.info("[Controller] find Locations by warehouseId: {}", warehouseId);
        return new BaseSuccessResponse<>(
            locationService.findAllByWarehouseId(warehouseId));

    }

    /**
     * 특정 로케이션 조회
     *
     * @param id -> 로케이션 아이디
     * @return location이 있으면 locationDto, 없으면 null
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<LocationResponseDto> findById(@PathVariable Long id)
        throws FloorException {
        log.info("[Controller] find Location by id: {}", id);
        return new BaseSuccessResponse<>(locationService.findById(id));
    }

    /**
     * 01 -10 이면 로케이션 10번 등록?
     *
     * @param request
     */
    @PostMapping
    public BaseSuccessResponse<Void> save(@RequestBody LocationSaveRequestDto request) {
        log.info("[Controller] save Location");
        locationService.save(request);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 로케이션 수정. 바꿀 정보를 locationDto에 담아 전달 -> 값 변경
     *
     * @param id          -> locationId
     * @param locationDto -> 바꿀 정보(이름과 좌표값들만 가능)
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<LocationResponseDto> update(@PathVariable Long id,
        @RequestBody LocationRequestDto locationDto) throws FloorException {
        log.info("[Controller] update Location by id: {}", id);
        return new BaseSuccessResponse<>(locationService.update(id, locationDto));
    }

    /**
     * 로케이션 삭제 -> 로케이션의 상태값을 삭제로 변경
     *
     * @param id -> locationId
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> delete(@PathVariable Long id)
        throws Exception, FloorException {
        log.info("[Controller] delete Location by id: {}", id);
        locationService.delete(id);
        return new BaseSuccessResponse<>(null);
    }

}
