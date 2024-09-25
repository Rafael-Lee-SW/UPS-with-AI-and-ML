package com.a302.wms.domain.device.entity;

import com.a302.wms.global.constant.DeviceTypeEnum;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Getter
@Builder
public class DeviceDetails implements Serializable {
    private String key;
    private DeviceTypeEnum type;
    private Long storeId;
}
