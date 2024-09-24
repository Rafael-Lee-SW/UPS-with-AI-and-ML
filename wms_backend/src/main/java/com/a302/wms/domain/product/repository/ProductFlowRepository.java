package com.a302.wms.domain.product.repository;

import com.a302.wms.domain.product.entity.ProductFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductFlowRepository extends JpaRepository<ProductFlow, Long> {

    @Query(value = "SELECT pf FROM product_flow pf WHERE pf.user_id = :userId ", nativeQuery = true)
    List<ProductFlow> findAllByUserId(Long userId);
//    @Query("SELECT pf FROM ProductFlow pf WHERE pf.store.id = :storeId " +
//            "AND pf.productFlowTypeEnum = :FLOW")
//    ProductFlowResponseDto findByStoreIdAndFlow(Long storeId);
//    @Query("SELECT pf FROM ProductFlow pf WHERE pf.store.id = :storeId " +
//            "AND pf.productFlowTypeEnum = :Import")
//    ProductFlowResponseDto findByStoreIdAndImport(Long storeId);
//    @Query("SELECT pf FROM ProductFlow pf WHERE pf.store.id = :storeId " +
//            "AND pf.productFlowTypeEnum = :Modify")
//    ProductFlowResponseDto findByStoreIdAndModify(Long storeId);
//
////    @Query("SELECT pf FROM ProductFlow pf " +
////            "JOIN pf.sku p " +
////            "JOIN p.store s " +
////            "JOIN " +
////    )
//    List<ProductFlowResponseDto> findAllByUserIdAndStoreId(Long userId, Long storeId);
//
//    List<ProductFlowResponseDto> findAllByUserIdAndProductFlowType(Long userId, ProductFlowTypeEnum productFlowTypeEnum);
}
