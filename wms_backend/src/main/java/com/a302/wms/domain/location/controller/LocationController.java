package com.a302.wms.domain.location.controller;

import com.a302.wms.domain.floor.exception.FloorException;
import com.a302.wms.domain.location.service.LocationServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import com.a302.wms.domain.location.dto.LocationRequestDto;
import com.a302.wms.domain.location.dto.LocationResponseDto;
import com.a302.wms.domain.location.dto.LocationSaveRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/locations")
public class LocationController {

    private final LocationServiceImpl locationService;

    /**
     * @param storeId -> 매장 아이디 (필수 )
     * @return storeId값 없으면 전체 조회, 있으면 특정 매장가 보유한 로케이션들 조회
     */
    @GetMapping
    public BaseSuccessResponse<List<LocationResponseDto>> findAllByStoreId(
        @RequestParam(name = "storeId") Long storeId) throws FloorException {
        log.info("[Controller] find Locations by storeId: {}", storeId);
        return new BaseSuccessResponse<>(
            locationService.findAllByStoreId(storeId));

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
        log.info("[Controller] find Location by productId: {}", id);
        return new BaseSuccessResponse<>(locationService.findById(id));
    }

    /**
     * 01 -10 이면 로케이션 10번 등록?
     *
     * @param request
     */
    @PostMapping
    public BaseSuccessResponse<Void> save(@RequestBody LocationSaveRequestDto request) throws FloorException {
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
        log.info("[Controller] update Location by productId: {}", id);
        return new BaseSuccessResponse<>(locationService.update(id, locationDto));
    }

    /**
     * 로케이션 삭제 -> 로케이션의 상태값을 삭제로 변경
     *
     * @param id -> locationId
     */
    @DeleteMapping("/{id}")
    public BaseSuccessResponse<Void> delete(@PathVariable Long id)
        throws Exception, FloorException {
        log.info("[Controller] delete Location by productId: {}", id);
        locationService.delete(id);
        return new BaseSuccessResponse<>(null);
    }

}
