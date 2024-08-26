package com.a508.wms.subscription.dto;

import com.a508.wms.util.constant.PaidTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.util.constant.SubscriptionTypeEnum;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDto {
    private Long id;
    private Long businessId;
    @Builder.Default
    private int warehouseCount = 1;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Builder.Default
    private PaidTypeEnum paidTypeEnum = PaidTypeEnum.CARD;
    private StatusEnum statusEnum;

}
