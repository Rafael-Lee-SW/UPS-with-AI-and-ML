package com.a302.wms.domain.device.repository;

import com.a302.wms.domain.device.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    List<Device> findByStoreId(Long storeId);

}
