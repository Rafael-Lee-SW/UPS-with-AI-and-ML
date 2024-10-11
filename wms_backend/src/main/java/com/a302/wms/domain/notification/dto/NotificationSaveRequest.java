package com.a302.wms.domain.notification.dto;

import com.a302.wms.global.constant.NotificationTypeEnum;
import lombok.Builder;

@Builder
public record NotificationSaveRequest(
        Long userId,
        Long storeId,
        NotificationTypeEnum notificationType,
        Boolean isRead,
        Boolean isImportant,
        String message) {
}
