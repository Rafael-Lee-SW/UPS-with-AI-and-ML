package com.a302.wms.domain.device.mapper;

import com.a302.wms.domain.device.dto.DeviceRegisterRequestDto;
import com.a302.wms.domain.device.dto.DeviceKeyResponseDto;
import com.a302.wms.domain.device.dto.DeviceResponseDto;
import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.store.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class DeviceMapper {

    public static Device toEntity(DeviceRegisterRequestDto deviceRegisterRequestDto, Store store) {
        return Device.builder()
                .store(store)
                .deviceKey(deviceRegisterRequestDto.key())
                .build();
    }

    public static DeviceResponseDto toDeviceResponseDto(Device device) {
        return DeviceResponseDto.builder()
                .id(device.getId())
                .storeId(device.getStore().getId())
                .build();
    }

    public static DeviceKeyResponseDto toDeviceKeyDto(Device device) {
        return DeviceKeyResponseDto.builder()
                .id(device.getId())
                .storeId(device.getStore().getId())
                .deviceKey(device.getDeviceKey())
                .build();
    }
}
