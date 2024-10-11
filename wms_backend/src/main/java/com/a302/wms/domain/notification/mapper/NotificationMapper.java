package com.a302.wms.domain.notification.mapper;

import com.a302.wms.domain.notification.dto.NotificationResponse;
import com.a302.wms.domain.notification.dto.NotificationUpdateRequest;
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
        .createdDate(notification.getCreatedDate())
        .build();
  }

  public static Notification fromNotificationUpdateResponse(
      NotificationUpdateRequest notificationUpdateResponse, Notification notification) {
    return Notification.builder()
        .id(notification.getId())
        .user(notification.getUser())
        .store(notification.getStore())
        .message(notification.getMessage())
        .cameraList(notification.getCameraList())
        .productFlowList(notification.getProductFlowList())
        .notificationTypeEnum(notification.getNotificationTypeEnum())
        .isRead(
            notificationUpdateResponse.isRead() != null
                ? notificationUpdateResponse.isRead()
                : notification.getIsRead())
        .isImportant(
            notificationUpdateResponse.isImportant() != null
                ? notificationUpdateResponse.isImportant()
                : notification.getIsImportant())
        .build();
  }
}
