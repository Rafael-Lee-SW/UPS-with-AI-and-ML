package com.a302.wms.product.repository;

import com.a302.wms.product.dto.ProductFlowResponseDto;
import com.a302.wms.product.entity.ProductFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductFlowRepository extends JpaRepository<ProductFlow, Long> {

    @Query("SELECT pf FROM ProductFlow pf WHERE pf.user.id = :userId")
    List<ProductFlow> findAllByUserId(Long userId);
    @Query("SELECT pf FROM ProductFlow pf WHERE pf.store.id = :storeId " +
            "AND pf.productFlowType = :FLOW")
    ProductFlowResponseDto findByStoreIdAndFlow(Long storeId);
    @Query("SELECT pf FROM ProductFlow pf WHERE pf.store.id = :storeId " +
            "AND pf.productFlowType = :Import")
    ProductFlowResponseDto findByStoreIdAndImport(Long storeId);
    @Query("SELECT pf FROM ProductFlow pf WHERE pf.store.id = :storeId " +
            "AND pf.productFlowType = :Modify")
    ProductFlowResponseDto findByStoreIdAndModify(Long storeId);

//    @Query("SELECT pf FROM ProductFlow pf " +
//            "JOIN pf.presentFloorId f " +
//    )
    List<ProductFlowResponseDto> findByUserIdAndStoreId(Long userId, Long storeId);
}
