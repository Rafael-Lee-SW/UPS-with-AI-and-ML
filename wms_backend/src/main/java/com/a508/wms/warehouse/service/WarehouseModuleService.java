package com.a508.wms.warehouse.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.repository.WarehouseRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WarehouseModuleService {

    private final WarehouseRepository warehouseRepository;
    private final BusinessRepository businessRepository;


    public Warehouse findById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID or business ID"));
    }

    /*
    비지니스 id로 창고 목록을 조회하는 메서드
     */
    public List<Warehouse> findByBusinessId(Long businessId) {
        return warehouseRepository.findByBusinessId(businessId); // 창고 목록 조회
    }


    public Warehouse save(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public Warehouse save(Warehouse warehouse, Long businessId) {
        Business business = businessRepository.getReferenceById(businessId);
        //
        return null;
    }

    /*
   창고를 비활성화하는 메서드 (상태를 DELETED로 설정, PATCH)
    */
    @Transactional
    public Warehouse delete(Warehouse warehouse) {
        warehouse.setStatusEnum(StatusEnum.DELETED);
        return save(warehouse);
    }

    public boolean notExist(Long warehouseId) {
        return !warehouseRepository.existsById(warehouseId);
    }
}
