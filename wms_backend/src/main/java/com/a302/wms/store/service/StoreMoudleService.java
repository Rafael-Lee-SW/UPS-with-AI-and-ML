package com.a302.wms.store.service;

import com.a302.wms.user.entity.User;
import com.a302.wms.user.repository.UserRepository;
import com.a302.wms.util.constant.StatusEnum;
import com.a302.wms.store.entity.Store;
import com.a302.wms.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoreMoudleService {

    private final StoreRepository warehouseRepository;
    private final UserRepository userRepository;


    public Store findById(Long storeId) {
        return warehouseRepository.findById(storeId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid store ID or user ID"));
    }

    /*
    비지니스 id로 매장 목록을 조회하는 메서드
     */
    public List<Store> findByUserId(Long userId) {
        return warehouseRepository.findByUserId(userId); // 매장 목록 조회
    }


    public Store save(Store store) {
        return warehouseRepository.save(store);
    }

    public Store save(Store store, Long userId) {
        User user = userRepository.getReferenceById(userId);
        //
        return null;
    }

    /*
   매장를 비활성화하는 메서드 (상태를 DELETED로 설정, PATCH)
    */
    @Transactional
    public Store delete(Store store) {
        store.setStatusEnum(StatusEnum.DELETED);
        return save(store);
    }

    public boolean notExist(Long storeId) {
        return !warehouseRepository.existsById(storeId);
    }
}
