package com.a302.wms.domain.kiosk.repository;

import com.a302.wms.domain.kiosk.entity.Kiosk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KioskRepository extends JpaRepository<Kiosk, Long> {

    List<Kiosk> findByStoreId(Long storeId);

}
