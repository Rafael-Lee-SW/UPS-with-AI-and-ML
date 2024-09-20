package com.a302.wms.store.repository;

import com.a302.wms.store.entity.Wall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WallRepository extends JpaRepository<Wall, Long> {

    List<Wall> findByStoreId(Long storeId);
}
