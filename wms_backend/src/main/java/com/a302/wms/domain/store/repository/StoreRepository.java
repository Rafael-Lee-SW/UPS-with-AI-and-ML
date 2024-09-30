package com.a302.wms.domain.store.repository;


import com.a302.wms.domain.store.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {

    List<Store> findAllByUserId(Long userId);
}
