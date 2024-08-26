package com.a508.wms.product.repository;

import com.a508.wms.product.domain.ProductFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductFlowRepository extends JpaRepository<ProductFlow, Long> {
    @Query("SELECT pf FROM ProductFlow pf WHERE pf.business.id = :businessId")
    List<ProductFlow> findAllByBusinessId(Long businessId);
}
