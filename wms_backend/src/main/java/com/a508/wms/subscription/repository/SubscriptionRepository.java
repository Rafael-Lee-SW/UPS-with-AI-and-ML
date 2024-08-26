package com.a508.wms.subscription.repository;

import com.a508.wms.subscription.domain.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    @Query("SELECT s FROM Subscription s WHERE s.business.id = :businessId")
    List<Subscription> findByBusinessId(@Param("businessId") long businessId);
}
