package com.a302.wms.domain.notification.mapper;

import com.a302.wms.domain.notification.dto.NotificationResponse;
import com.a302.wms.domain.notification.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {


    public static NotificationResponse toNotificationResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .storeId(notification.getStore().getId())
                .isRead(notification.getIsRead())
                .isImportant(notification.getIsImportant())
                .notificationTypeEnum(notification.getNotificationTypeEnum())
                .message(notification.getMessage())
                .build();
    }

}
