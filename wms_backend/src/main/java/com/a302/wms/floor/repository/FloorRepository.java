package com.a302.wms.floor.repository;

import com.a302.wms.floor.entity.Floor;
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
        + "AND l.name LIKE '00-00' "
        + " AND f.floorLevel=:floorLevel")
    Floor findByStoreId(@Param("storeId") Long storeId,
        @Param("floorLevel") int floorLevel);

    @Query("SELECT f FROM Floor f WHERE f.floorLevel = :floorLevel " +
        "AND f.location.id = :locationId ")
    Floor findByLocationIdAndFloorLevel(Long locationId, int floorLevel);

    @Query(value =
            "SELECT f.* " +
            "FROM floor f " +
            "JOIN location l ON l.id = f.location_id " +
            "WHERE f.floor_level > 1 " +
            "AND l.store_id = :storeId " +
            "ORDER BY substr(l.name,2), substr(l.name from 3), f.floor_level", nativeQuery = true)
    List<Floor> findAllEmptyFloorByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT f FROM Floor f " +
        "JOIN f.product p " +
        "JOIN f.location l " +
        "JOIN l.store s " +
        "WHERE s.id = :storeId "
        + "AND f.floorLevel > 0 "
        + "AND p.quantity > 0 ")
    List<Floor> findAllNotEmptyFloorByStoreId(@Param("storeId") Long storeId);


    //SELECT e FROM Employee e
    // LEFT JOIN e.department d
    // WHERE d.productName = :departmentName")
}

