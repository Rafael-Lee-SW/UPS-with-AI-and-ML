package com.a302.wms.domain.device.entity;

import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.global.constant.DeviceTypeEnum;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Entity
@Getter
@RequiredArgsConstructor
@Table(name="Device")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "device_type", nullable = false)
    private DeviceTypeEnum deviceType;

    @Column(nullable = false)
    private String deviceKey;


    @Builder
    public Device(Store store, String deviceKey, DeviceTypeEnum deviceType) {
        this.store = store;
        this.deviceKey = deviceKey;
        this.deviceType = deviceType;
    }
}
