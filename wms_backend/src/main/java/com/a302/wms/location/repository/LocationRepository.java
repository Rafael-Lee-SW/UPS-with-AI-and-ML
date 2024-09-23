package com.a302.wms.location.repository;

import com.a302.wms.location.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {

    @Query("SELECT l FROM Location l JOIN FETCH l.store s WHERE s.id = :storeId")
    List<Location> findAllByStoreId(Long storeId);

    @Query("SELECT l from Location l where l.name = :productName " +
        "AND l.store.id = :storeId ")
    Location findByNameAndStoreId(@Param("productName") String productName, @Param("storeId") Long storeId);

    @Query("SELECT l FROM Location l WHERE l.zSize > 0 ")
    List<Location> findAllMaxStorage();



}

