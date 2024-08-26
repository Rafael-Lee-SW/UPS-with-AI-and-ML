package com.a508.wms.warehouse.repository;

import com.a508.wms.warehouse.domain.Wall;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WallRepository extends JpaRepository<Wall, Long> {

    List<Wall> findByWarehouseId(Long warehouseId);
}
