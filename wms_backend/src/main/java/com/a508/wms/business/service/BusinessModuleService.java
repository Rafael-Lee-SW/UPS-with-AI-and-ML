package com.a508.wms.business.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusinessModuleService {

    private final BusinessRepository businessRepository;

    /**
     * 특정 id를 가진 사업체의 정보를 조회하는 메서드
     *
     * @param businessId: 사업체 고유 번호
     * @return BusinessDto
     */
    public Business findById(long businessId) {
        return businessRepository.findById(businessId).orElse(null);
    }

    public Business findByUserId(Long userId) {
        return businessRepository.findByUserId(userId);
    }

    /**
     * 모든 사업체의 정보를 조회하는 메서드
     *
     * @return List<BusinessDto>
     */
    public List<Business> findAll() {
        return businessRepository.findAll();
    }

    /**
     * 사업체의 정보를 저장하는 기능
     *
     * @param business : 저장할 메서드
     * @return
     */
    public Business save(Business business) {
        return businessRepository.save(business);
    }


    /**
     * 사업체의 정보를 삭제하는 메서드 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리
     */

    public Business delete(Business business) {
        business.setStatusEnum(StatusEnum.DELETED);
        business.setUser(null);
        return save(business);
    }
}
