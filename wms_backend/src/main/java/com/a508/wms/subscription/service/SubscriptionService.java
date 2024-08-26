package com.a508.wms.subscription.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.subscription.domain.Subscription;
import com.a508.wms.subscription.dto.SubscriptionDto;
import com.a508.wms.subscription.mapper.SubscriptionMapper;
import com.a508.wms.subscription.repository.SubscriptionRepository;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final BusinessRepository businessRepository;


    /**
     * 구독 테이블의 모든 정보를 반환하는 메서드
     *
     * @return List<SubscriptionDto>
     */
    @Transactional(readOnly = true)
    public List<SubscriptionDto> findAll() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        log.info("subscriptions: {}",
            subscriptions.stream().map(SubscriptionMapper::fromSubscription).toList());
        return subscriptions.stream().map(SubscriptionMapper::fromSubscription).toList();
    }

    /**
     * 특정 사업체의 모든 구독 정보를 반환하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return SubscriptionDto List
     */
    public List<SubscriptionDto> findsByBusinessId(long id) {
        List<Subscription> subscriptions = subscriptionRepository.findByBusinessId(id);
        return subscriptions.stream().map(SubscriptionMapper::fromSubscription).toList();
    }

    /**
     * 특정 사업체의 구독 정보를 추가하는 메서드
     *
     * @param subscriptionDto:추가할 구독 정보
     * @return SubscriptionDto
     */
    @Transactional
    public SubscriptionDto save(SubscriptionDto subscriptionDto) {
        // 사업체 정보를 가져옵니다. 만약 존재하지 않으면 예외를 발생시킵니다.
        Business business = businessRepository.findById(subscriptionDto.getBusinessId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid business Id:" + subscriptionDto.getBusinessId()));

        // DTO를 통해 Subscription 객체를 생성합니다.
        Subscription subscription = SubscriptionMapper.fromDto(subscriptionDto);

        // Subscription에 Business를 설정합니다.
        subscription.setBusiness(business);

        // 창고 개수를 기본값 1로 설정합니다.
        subscription.setWarehouseCount(subscriptionDto.getWarehouseCount());

        // 새로운 Subscription을 데이터베이스에 저장하고 저장된 엔티티를 DTO로 변환하여 반환합니다.
        return SubscriptionMapper.fromSubscription(subscriptionRepository.save(subscription));
    }

    /**
     * 특정 사업체의 구독 정보를 수정하는 메서드
     *
     * @param subScriptionId : 구독 고유 번호, subscriptionDto: 수정할 구독 정보
     * @return SubscriptionDto
     */
    @Transactional
    public SubscriptionDto update(Long subScriptionId, SubscriptionDto subscriptionDto) {
        // 주어진 ID로 구독을 조회
        Subscription subscription = subscriptionRepository.findById(subScriptionId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid subscription Id:" + subScriptionId));

        // DTO에 제공된 필드가 있는 경우 기존 구독의 필드를 업데이트
        if (subscriptionDto.getWarehouseCount() != 0) { // 기본값 0을 체크하여 업데이트
            subscription.setWarehouseCount(subscriptionDto.getWarehouseCount());
        }
        if (subscriptionDto.getStartDate() != null) {
            subscription.setStartDate(subscriptionDto.getStartDate());
        }
        if (subscriptionDto.getEndDate() != null) {
            subscription.setEndDate(subscriptionDto.getEndDate());
        }
        if (subscriptionDto.getPaidTypeEnum() != null) {
            subscription.setPaidTypeEnum(subscriptionDto.getPaidTypeEnum());
        }
        if (subscriptionDto.getStatusEnum() != null) {
            subscription.setStatusEnum(subscriptionDto.getStatusEnum());
        }

        // 업데이트된 구독을 저장하고 DTO로 반환
        return SubscriptionMapper.fromSubscription(subscriptionRepository.save(subscription));
    }

    /**
     * 특정 사업체의 구독 정보를 삭제하는 메서드
     *
     * @param id : 구독 고유 번호
     */
    @Transactional
    public void delete(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid subscription Id:" + id));
        subscription.setStatusEnum(StatusEnum.DELETED);
        subscriptionRepository.save(subscription);
    }
}
