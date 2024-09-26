package com.a302.wms.domain.device.controller;

import com.a302.wms.domain.device.dto.DeviceCreateRequest;
import com.a302.wms.domain.device.dto.DeviceKeyCreateRequest;
import com.a302.wms.domain.device.dto.DeviceDetailedResponse;
import com.a302.wms.domain.device.dto.DeviceResponse;
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

    private final DeviceServiceImpl deviceService;

    /**
     * 유저에 속한 매장에 대한 디바이스 전체를 반환합니다.
     * @param userId
     * @return
     */
    @GetMapping
    @Operation(summary = "디바이스 목록 조회 (키값 제외)", tags = { "디바이스 관리" })
    public BaseSuccessResponse<List<List<DeviceResponse>>> getUserDevicesList(
            @RequestParam(required = true) Long userId
    ) {
        log.info("[Controller] get devices list of the user");
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
    public BaseSuccessResponse<DeviceDetailedResponse> getDeviceKey(
            @RequestParam(required = true) Long userId,
            @PathVariable(required = true) Long deviceId
    ) {
        log.info("[Controller] get device key of the device");
        return new BaseSuccessResponse<>(deviceService.getDetailedInfo(userId, deviceId));
    }

    /**
     * 매장에 대한 디바이스의 키를 생성하는 메서드
     * @param dto 
     * @return
     */
    @PostMapping("/keys")
    public BaseSuccessResponse<String> createDeviceKey(
            @RequestBody DeviceKeyCreateRequest dto
            )   {
        log.info("[Controller] create device key for the store");
        return new BaseSuccessResponse<>(UUID.randomUUID().toString());
    }

    /**
     * 디바이스를 새로 등록합니다.
     * @param dto
     * @return
     */
    @PostMapping
    @Operation(summary = "디바이스 등록", tags = { "디바이스 관리" })
    public BaseSuccessResponse<Void> saveDevice(
            @RequestBody(required = true) DeviceCreateRequest dto
    ) {
        log.info("[Controller] create device for the key");
        return new BaseSuccessResponse<>(null);
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
        log.info("[Controller] delete device for the store");
        deviceService.deleteDevice(userId, deviceId);
        return new BaseSuccessResponse<>(null);
    }
}
