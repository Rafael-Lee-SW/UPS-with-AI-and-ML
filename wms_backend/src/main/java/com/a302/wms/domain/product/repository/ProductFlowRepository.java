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
}
