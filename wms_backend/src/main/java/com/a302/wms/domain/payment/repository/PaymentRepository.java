package com.a302.wms.domain.payment.repository;

import com.a302.wms.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query(value = "SELECT p FROM Payment p " +
            "WHERE p.store = :storeId " +
            "AND p.createdDate " +
            "BETWEEN :startDateTime and :endDateTime " +
            "ORDER BY p.createdDate DESC")
    List<Payment> findPaymentsByStoreIdAndPaidAtBetween(@Param("storeId") Long storeId, LocalDateTime startDateTime, LocalDateTime endDateTime);


    List<Payment> findPaymentsByOrderId(String orderId);
}
