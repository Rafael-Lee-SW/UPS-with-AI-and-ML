package com.a302.wms.product.repository;

import com.a302.wms.floor.entity.Floor;
import com.a302.wms.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p " +
            "JOIN p.store s " +
            "JOIN s.user u " +
            "WHERE u.id = :userId")
    List<Product> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Product p " +
            "JOIN p.floor f " +
            "JOIN f.location l " +
            "JOIN l.store w " +
            "WHERE w.id = :warehouseID")
    List<Product> findByStoreId(@Param("warehouseId") Long warehouseID);

    @Query("SELECT p FROM Product p " +
            "JOIN p.floor f " +
            "JOIN f.location l " +
            "WHERE l.id = :locationID")
    List<Product> findByLocationId(@Param("locationId") Long locationID);



}

