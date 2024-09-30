package com.a302.wms.domain.product.repository;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

  @Query("SELECT p FROM Product p " + "WHERE p.store.id = :storeId ")
  List<Product> findByStoreId(@Param("storeId") Long storeId);

  @Query("SELECT p FROM Product p " + "JOIN p.store s " + "JOIN s.user u " + "WHERE u.id = :userId")
  List<Product> findAllByUserId(Long userId);

  @Query("SELECT p FROM Product p " + "WHERE p.floor = :floor")
  List<Product> findAllByFloor(Floor floor);
}
