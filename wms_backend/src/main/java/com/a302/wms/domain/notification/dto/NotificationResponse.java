package com.a302.wms.domain.notification.dto;

import com.a302.wms.global.constant.NotificationTypeEnum;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
public record NotificationResponse(
        Long id,
        Long userId,
        Long storeId,
        Boolean isRead,
        Boolean isImportant,
        String message,
        LocalDateTime createdDate,
        NotificationTypeEnum notificationTypeEnum) {
}
