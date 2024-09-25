package com.a302.wms.domain.store.repository;

import com.a302.wms.domain.store.entity.Wall;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WallRepository extends JpaRepository<Wall, Long> {

  List<Wall> findByStoreId(Long storeId);
}
