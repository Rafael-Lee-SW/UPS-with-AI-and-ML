package com.a302.wms.domain.store.repository;

import com.a302.wms.domain.store.entity.Store;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StoreRepository extends JpaRepository<Store, Long> {

  List<Store> findAllByUserId(Long userId);

  @Query(
      "SELECT s FROM Store s JOIN Product p ON p.store.id = s.id WHERE p.productId = :productId ")
  Store findByProductId(Long productId);
}
