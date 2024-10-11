package com.a302.wms.domain.floor.repository;

import com.a302.wms.domain.floor.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FloorRepository extends JpaRepository<Floor, Long> {

    List<Floor> findAllByLocationId(Long locationId);

    @Query("SELECT f FROM Floor f " +
        "JOIN f.location l " +
        "JOIN l.store s " +
        "WHERE s.id = :storeId "
        + " AND f.floorLevel=:floorLevel ")
    Floor findByStoreIdAndLevel(@Param("storeId") Long storeId,
                                @Param("floorLevel") int floorLevel);

    @Query("SELECT f FROM Floor f " +
            "JOIN f.location l " +
            "WHERE l.id = :locationId " +
            "AND f.floorLevel = :floorLevel ")
    Floor findByLocationIdAndFloorLevel(Long locationId, Integer floorLevel);
}

