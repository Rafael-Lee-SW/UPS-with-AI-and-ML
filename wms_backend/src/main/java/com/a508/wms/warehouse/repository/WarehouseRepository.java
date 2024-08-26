package com.a508.wms.warehouse.repository;

import com.a508.wms.warehouse.domain.Warehouse;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    List<Warehouse> findByBusinessId(Long businessId);

    @Query("SELECT w FROM Warehouse w " +
        "JOIN FETCH w.business b " +
        "WHERE b.id = :businessId " +
        "ORDER BY " +
        "CASE w.facilityTypeEnum " +
        "  WHEN com.a508.wms.util.constant.FacilityTypeEnum.STORE THEN 1 " +
        "  WHEN com.a508.wms.util.constant.FacilityTypeEnum.WAREHOUSE THEN 2 " +
        "  ELSE 3 END, " +
        "w.priority ASC")
    List<Warehouse> findExportOrderWarehouse(
        @Param("businessId") Long businessId);

    int countByBusinessId(Long businessId);

}
