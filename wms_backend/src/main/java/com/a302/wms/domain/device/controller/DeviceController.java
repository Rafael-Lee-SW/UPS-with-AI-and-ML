package com.a302.wms.domain.device.controller;

import com.a302.wms.domain.device.dto.DeviceCreateRequest;
import com.a302.wms.domain.device.dto.DeviceDetailedResponse;
import com.a302.wms.domain.device.dto.DeviceResponse;
import com.a302.wms.domain.device.service.DeviceServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/devices")
@Tag(name = "디바이스 관리", description = "디바이스 관련 API")
public class DeviceController {

    private final DeviceServiceImpl deviceService;

    /**
     * 유저에 속한 매장에 대한 디바이스 전체를 조회합니다.
     *
     * @param userId
     * @return
     */
    @GetMapping
    @Operation(summary = "디바이스 목록 조회 (키값 제외)", tags = {"디바이스 관리"})
    public BaseSuccessResponse<List<List<DeviceResponse>>> getUserDevicesList(
            @AuthenticationPrincipal Long userId
    ) {
        log.info("[Controller] get devices list of the user");
        return new BaseSuccessResponse<>(deviceService.getUserDevicesList(userId));
    }

    @GetMapping("/{deviceId}")
    public BaseSuccessResponse<DeviceDetailedResponse> getDeviceDetailed(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long deviceId) {
        log.info("[Controller] get device details of the device");
        return new BaseSuccessResponse<>(deviceService.getDetailedInfo(userId, deviceId));
    }


    /**
     * 디바이스를 새로 생성하여 저장합니다.
     *
     * @param deviceCreateRequest
     * @return
     */
    @PostMapping
    @Operation(summary = "디바이스 등록", tags = {"디바이스 관리"})
    public BaseSuccessResponse<DeviceResponse> saveDevice(
            @AuthenticationPrincipal Long userId,
            @RequestBody DeviceCreateRequest deviceCreateRequest
    ) {
        log.info("[Controller] create device for the key");
        return new BaseSuccessResponse<>(deviceService.save(userId, deviceCreateRequest));
    }

    /**
     * 디바이스를 삭제합니다.
     *
     * @param userId
     * @param deviceId
     * @return
     */
    @PostMapping("/{deviceId}")
    @Operation(summary = "디바이스 삭제", tags = {"디바이스 관리"})
    public BaseSuccessResponse<Void> deleteDevice(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long deviceId
    ) {
        log.info("[Controller] delete device for the store");
        deviceService.deleteDevice(userId, deviceId);
        return new BaseSuccessResponse<>(null);
    }
}
