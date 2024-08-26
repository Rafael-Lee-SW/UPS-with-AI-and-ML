package com.a508.wms.warehouse.service;

import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Wall;
import com.a508.wms.warehouse.repository.WallRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WallModuleService {

    private final WallRepository wallRepository;


    /*창고 id로 벽을 조회하는 메서드
     */
    public List<Wall> findByWarehouseId(Long warehouseId) {
        return wallRepository.findByWarehouseId(warehouseId);
    }

    public Wall save(Wall wall) {
        return wallRepository.save(wall);
    }

    public Wall update(Wall wall) {
        return wallRepository.save(wall);
    }

    /*
   창고를 비활성화하는 메서드 (상태를 DELETED로 설정, PATCH)
    */
    @Transactional
    public Wall delete(Wall wall) {
        wall.updateStatus(StatusEnum.DELETED);
        return save(wall);
    }
}
