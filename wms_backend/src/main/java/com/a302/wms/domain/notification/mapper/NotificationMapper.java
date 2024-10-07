package com.a302.wms.domain.notification.mapper;

import com.a302.wms.domain.notification.dto.NotificationResponse;
import com.a302.wms.domain.notification.dto.NotificationSaveRequest;
import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.user.entity.User;
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
    public static com.a302.wms.domain.notification.entity.Notification fromCameraSaveRequest(NotificationSaveRequest notificationSaveRequest,
                                                                                             User user,
                                                                                             Store store) {
        return com.a302.wms.domain.notification.entity.Notification.builder()
                .user(user)
                .store(store)
                .isRead(notificationSaveRequest.isRead())
                .isImportant(notificationSaveRequest.isImportant())
                .message(notificationSaveRequest.message())
                .notificationTypeEnum(notificationSaveRequest.notificationType())
                .build();
    }
}
