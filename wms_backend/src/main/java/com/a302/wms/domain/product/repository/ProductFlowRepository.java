package com.a302.wms.domain.product.repository;

import com.a302.wms.domain.product.entity.ProductFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductFlowRepository extends JpaRepository<ProductFlow, Long> {


    @Query("SELECT pf " +
            "FROM ProductFlow pf " +
            "WHERE pf.userId = :userId ")
    List<ProductFlow> findAllByUserId(Long userId);

    @Query(value = "SELECT pf.* " +
            "FROM product_flow pf " +
            "JOIN store s on pf.user_id = s.user_id " +
            "WHERE s.id = :storeId ",nativeQuery = true )
    List<ProductFlow> findAllByStoreId(Long storeId);
}
