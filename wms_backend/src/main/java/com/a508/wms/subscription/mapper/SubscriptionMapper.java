package com.a508.wms.subscription.mapper;

import com.a508.wms.subscription.domain.Subscription;
import com.a508.wms.subscription.dto.SubscriptionDto;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionMapper {
    /**
     * SubscriptionDto 객체를 Subscription으로 변경해주는 메서드
     * business, subscriptionType 제외. 직접 설정하기
     * @param subscriptionDto
     * @return Subscription 객체
     */
    public static Subscription fromDto(SubscriptionDto subscriptionDto) {
           return Subscription.builder()
                   .id(subscriptionDto.getId())
                   .warehouseCount(subscriptionDto.getWarehouseCount())
                   .startDate(subscriptionDto.getStartDate())
                   .endDate(subscriptionDto.getEndDate())
                   .statusEnum(subscriptionDto.getStatusEnum())
                   .paidTypeEnum(subscriptionDto.getPaidTypeEnum())
                   .build();
    }
    /**
     * Subscription 객체를 SubscriptionDto로 변경해주는 메서드
     *
     * @param subscription
     * @return SubscriptionDto 객체
     */
    public static SubscriptionDto fromSubscription(Subscription subscription) {
       return SubscriptionDto.builder()
               .id(subscription.getId())
               .businessId(subscription.getBusiness().getId())
               .warehouseCount(subscription.getWarehouseCount())
               .startDate(subscription.getStartDate())
               .endDate(subscription.getEndDate())
               .statusEnum(subscription.getStatusEnum())
               .paidTypeEnum(subscription.getPaidTypeEnum())
               .build();
    }
}
