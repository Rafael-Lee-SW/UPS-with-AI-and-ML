package com.a302.wms.domain.product.repository;

import com.a302.wms.domain.product.entity.ProductFlow;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface ProductFlowRepository extends JpaRepository<ProductFlow, Long> {


    @Query("SELECT pf " +
            "FROM ProductFlow pf " +
            "WHERE pf.userId = :userId ")
    List<ProductFlow> findAllByUserId(Long userId);

    @Query(value = "SELECT pf.* " +
            "FROM product_flow pf " +
            "JOIN store s on pf.user_id = s.user_id " +
            "WHERE s.id = :storeId ", nativeQuery = true)
    List<ProductFlow> findAllByStoreId(Long storeId);

    @Query("SELECT pf " +
            "FROM ProductFlow pf " +
            "WHERE pf.notification.id = :notificationId ")
    List<ProductFlow> findAllByNotificationId(Long notificationId);

    @Query("SELECT pf " +
            "FROM ProductFlow pf " +
            "JOIN Product p ON p.barcode = pf.barcode " +
            "WHERE p.productId = :productId AND " +
            "pf.productFlowTypeEnum = :productFlowTypeEnum ")
    List<ProductFlow> findAllByProductIdAndType(Long productId, ProductFlowTypeEnum productFlowTypeEnum);

    @Query("SELECT pf " +
            "FROM ProductFlow pf " +
            "JOIN Product p ON p.barcode = pf.barcode " +
            "WHERE p.productId = :productId ")
    List<ProductFlow> findAllByProductId(Long productId);
}
