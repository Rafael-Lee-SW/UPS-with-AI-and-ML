package com.a508.wms.business.repository;

import com.a508.wms.business.domain.Business;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessRepository extends JpaRepository<Business, Long> {

    public Business findByUserId(Long userId);
}
