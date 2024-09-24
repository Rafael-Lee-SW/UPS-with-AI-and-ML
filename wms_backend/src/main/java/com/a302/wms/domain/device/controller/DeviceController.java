package com.a302.wms.domain.device.controller;

import com.a302.wms.domain.device.dto.DeviceCreateRequestDto;
import com.a302.wms.domain.device.dto.DeviceKeyCreateDto;
import com.a302.wms.domain.device.dto.DeviceKeyResponseDto;
import com.a302.wms.domain.device.dto.DeviceResponseDto;
import com.a302.wms.domain.device.service.DeviceServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/devices")
@Tag(name = "디바이스 관리", description = "디바이스 관련 API")
public class DeviceController {

    // TODO interface 추출 후 변경
    private final DeviceServiceImpl deviceService;

    /**
     * 유저에 속한 매장에 대한 디바이스 전체를 반환합니다.
     * @param userId
     * @return
     */
    @GetMapping
    @Operation(summary = "디바이스 목록 조회 (키값 제외)", tags = { "디바이스 관리" })
    public BaseSuccessResponse<List<List<DeviceResponseDto>>> getUserDevicesList(
            @RequestParam(required = true) Long userId
    ) {
        log.info("[Controller] get devices list of the user: {}", userId);
        return new BaseSuccessResponse<>(deviceService.getUserDevicesList(userId));
    }

    /**
     * 특정 디바이스의 키를 포함한 정보를 반환합니다.
     * @param userId
     * @param deviceId
     * @return
     */
    @GetMapping("/{deviceId}")
    @Operation(summary = "디바이스 키 조회", tags = { "디바이스 관리" })
    public BaseSuccessResponse<DeviceKeyResponseDto> getDeviceKey(
            @RequestParam(required = true) Long userId,
            @PathVariable(required = true) Long deviceId
    ) {
        log.info("[Controller] get device key of the device: {}", deviceId);
        return new BaseSuccessResponse<>(deviceService.getDetailedInfo(userId, deviceId));
    }

    /**
     * 매장에 대한 기기를 등록하는 메서드
     * @param dto 
     * @return
     */
    @PostMapping("/keys")
    public BaseSuccessResponse<String> createDeviceKey(
//            @RequestParam Long userId,
            @RequestBody DeviceKeyCreateDto dto
            )   {
        log.info("[Controller] create device key for the store: {}", dto.storeId());
//        return deviceService.createDeviceKey(dto);
        return new BaseSuccessResponse<>(UUID.randomUUID().toString());
    }

    /**
     * 디바이스를 새로 등록합니다.
     * @param userId
     * @param requestDto
     * @return
     */
    @PostMapping
    @Operation(summary = "디바이스 등록", tags = { "디바이스 관리" })
    public BaseSuccessResponse<DeviceResponseDto> saveDevice(
            @RequestParam(required = true) Long userId,
            @RequestBody(required = true) DeviceCreateRequestDto requestDto
    ) {
        log.info("[Controller] create device for the store: {}", requestDto.storeId());
        return new BaseSuccessResponse<>(deviceService.saveDevice(userId, requestDto));
    }

    /**
     * 디바이스를 삭제합니다.
     * @param userId
     * @param deviceId
     * @return
     */
    @PostMapping("/{deviceId}")
    @Operation(summary = "디바이스 삭제", tags = { "디바이스 관리" })
    public BaseSuccessResponse<Void> deleteDevice(
            @RequestParam(required = true) Long userId,
            @PathVariable Long deviceId
    ) {
        log.info("[Controller] delete device for the store: {}",deviceId);
        deviceService.deleteDevice(userId, deviceId);
        return new BaseSuccessResponse<>(null);
    }
}
