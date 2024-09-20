package com.a302.wms.store.repository;

import com.a302.wms.store.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {

    List<Store> findByUserId(Long userId);

    @Query("SELECT s FROM Store s " +
        "JOIN FETCH s.user b " +
        "WHERE b.id = :userId " +
        "ORDER BY " +
        "CASE s.facilityTypeEnum " +
        "  WHEN com.a302.wms.util.constant.FacilityTypeEnum.STORE THEN 1 " +
        "  WHEN com.a302.wms.util.constant.FacilityTypeEnum.WAREHOUSE THEN 2 " +
        "  ELSE 3 END, " +
        "s.priority ASC")
    List<Store> findExportOrderStore(
        @Param("userId") Long userId);

    int countByUserId(Long userId);

}
