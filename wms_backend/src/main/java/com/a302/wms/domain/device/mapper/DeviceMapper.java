package com.a302.wms.domain.device.mapper;

import com.a302.wms.domain.device.dto.DeviceCreateRequest;
import com.a302.wms.domain.device.dto.DeviceDetailedResponse;
import com.a302.wms.domain.device.dto.DeviceResponse;
import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.store.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class DeviceMapper {

    /**
     * DeviceCreateRequest에서 Device entity로 변환
     * @param deviceCreateRequest
     * @param store
     * @return
     */
    public static Device fromCreateRequestDto(DeviceCreateRequest deviceCreateRequest, Store store) {
        return Device.builder()
                .store(store)
                .deviceType(deviceCreateRequest.deviceType())
                .build();
    }

    /**
     * Device Entity에서 DeviceResponseDto로 변경
     * @param device
     * @return
     */
    public static DeviceResponse toResponseDto(Device device) {
        return DeviceResponse.builder()
                .id(device.getId())
                .storeId(device.getStore().getId())
                .build();
    }

    /**
     * Device Entity에서 DeviceDetailedResponseDto로 변환
     * @param device
     * @return
     */
    public static DeviceDetailedResponse toDetailedResponseDto(Device device) {
        return DeviceDetailedResponse.builder()
                .id(device.getId())
                .storeId(device.getStore().getId())
                .deviceKey(device.getDeviceKey())
                .build();
    }
}
