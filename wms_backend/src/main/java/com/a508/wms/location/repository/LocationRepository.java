package com.a508.wms.location.repository;

import com.a508.wms.location.domain.Location;
import java.util.List;

import com.a508.wms.product.dto.ProductMoveRequestDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LocationRepository extends JpaRepository<Location, Long> {

    @Query("SELECT l FROM Location l JOIN FETCH l.warehouse w WHERE w.id = :warehouseId")
    List<Location> findAllByWarehouseId(Long warehouseId);

    @Query("SELECT l from Location l where l.name = :name " +
        "AND l.warehouse.id = :warehouseId ")
    Location findByNameAndWarehouseId(@Param("name") String name, Long warehouseId);
    @Query("SELECT l FROM Location l WHERE l.zSize > 0 ")
    List<Location> findAllMaxStorage();

    @Query(value = " SELECT * FROM location l " +
            "WHERE l.warehouse_id = :warehouseId " +
            "ORDER BY CAST(SUBSTRING_INDEX(l.name, '-', 1) AS UNSIGNED), " +
            "CAST(SUBSTRING_INDEX(l.name, '-', -1) AS UNSIGNED) ", nativeQuery = true)
    List<Location> findAllSortedByWarehouseId(@Param("warehouseId") Long warehouseId);
}

