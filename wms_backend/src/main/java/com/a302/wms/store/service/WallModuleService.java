package com.a302.wms.store.service;

import com.a302.wms.util.constant.StatusEnum;
import com.a302.wms.store.entity.Wall;
import com.a302.wms.store.repository.WallRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WallModuleService {

    private final WallRepository wallRepository;


    /*매장 id로 벽을 조회하는 메서드
     */
    public List<Wall> findByStoreId(Long storeId) {
        return wallRepository.findByStoreId(storeId);
    }

    public Wall save(Wall wall) {
        return wallRepository.save(wall);
    }

    public Wall update(Wall wall) {
        return wallRepository.save(wall);
    }

    /*
   매장를 비활성화하는 메서드 (상태를 DELETED로 설정, PATCH)
    */
    @Transactional
    public Wall delete(Wall wall) {
        wall.updateStatus(StatusEnum.DELETED);
        return save(wall);
    }
}
